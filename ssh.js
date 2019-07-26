const readline = require('readline');
const { Client } = require('ssh2');

const {
  downloadFile,
  uploadFile,
  handleSIGINT,
  createLocalTunnel,
} = require('./services');

const { completer } = require('./utils');

const config = require('./config');

const conn = new Client();

conn.on('ready', () => {
  if (process.argv[2] === '-L') {
    const args = process.argv[3].split(':');
    if (args.length !== 3) {
      throw Error('Please use correct notation for ssh forwarding');
    }

    const fromPort = args[0];
    const toPort = args[2];
    const remoteHost = args[1];

    // Very basic validation
    if (!fromPort || isNaN(fromPort) || !toPort || isNaN(toPort)) {
      throw Error('Please provide valid port numbers');
    }

    if (
      remoteHost.split('.').length !== 4
      || remoteHost.split('.').some(n => !n || isNaN(n) || parseInt(n) > 255 || parseInt(n) < 0)
    ) {
      throw Error('Please provide valid remote host address');
    }
    createLocalTunnel(conn, fromPort, remoteHost, toPort);
  } else {
    conn.shell((err, stream) => {
      if (err) throw err;

      let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        preserveCursor: true,
        completer: completer,
      });

      stream.on('close', () => {
        console.log('Connection closed.');
        conn.end();
        process.exit(0);
      }).on('data', data => {
        // setPrompt disables default behavior of readline.
        rl.setPrompt('' + data);
        process.stdin.pause();
        process.stdout.write(data);
        process.stdin.resume();
      }).stderr.on('data', data => {
        process.stderr.write(data);
      });

      rl.on('line', line => {
        const trimmedLine = line.trim();
        const args = trimmedLine.split(' ');

        switch (args[0]) {
          // Not the best solution.
          case 'get':
            downloadFile(stream, conn, args, config.host);
            break;
          case 'put':
            uploadFile(stream, conn, args, config.host);
            break;
          default:
            stream.write(line.trim() + '\n');
            break;
        }
      });

      rl.on('SIGINT', () => {
        handleSIGINT(conn);
      });
    });
  }
})
.connect(config);