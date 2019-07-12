const fs = require('fs');
const readline = require('readline');
const { Client } = require('ssh2');

const {
  downloadFile,
  uploadFile,
  handleSIGINT,
  createLocalTunnel,
} = require('./services');

const config = require('./config');

console.log(config);

const conn = new Client();
conn.on('ready', () => {
  if (process.argv[2] === '-L') {
    const args = process.argv[3].split(':');
    if (args.length === 3) {
      createLocalTunnel(conn, args[0], args[1], args[2]);
    } else if (args.length === 4) {
      createLocalTunnel(conn, args[1], args[2], args[3], args[0]);
    }
  } else {
    conn.shell((err, stream) => {
      if (err) throw err;
  
      let rl = readline.createInterface(process.stdin, process.stdout);
  
      stream.on('close', () => {
        console.log('Connection closed.');
        conn.end();
        process.exit(0);
      }).on('data', function(data) {
        process.stdin.pause();
        process.stdout.write(data);
        process.stdin.resume();
      }).stderr.on('data', data => {
        process.stderr.write(data);
      });
  
      rl.on('line', (line) => {
        const trimmedLine = line.trim();
        const args = trimmedLine.split(' ');
  
        switch (args[0]) {
          // Not the best solution
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