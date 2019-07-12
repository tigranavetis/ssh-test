const { killProcess } = require('../utils');

function handleSIGINT(conn) {
  const getCurrPID = `ps aux | grep '[p]ts/*' | awk '{ if ($7 == "pts/0" || $7 == "pts/1") print $11, $2 }'`;
  const processes = new Map();

  conn.exec(getCurrPID, (err, stream) => {
    if (err) {
      console.error(err);
      stream.end('exit\n');
    }

    stream.on('data', buff => {
      const proc = '' + buff;
      const procArr = proc.trim().split('\n');
      procArr.forEach(p => {
        const name = p.split(' ')[0];
        const pid = parseInt(p.split(' ')[1]);
        processes.set(name, pid);
      });
    }).on('end', () => {
      if (processes.size === 1) {
        for (let pid of processes.values()) {
          killProcess(conn, pid);
        }
      } else {
        for(let k of processes.keys()) {
          if (k !== '-bash') {
            const pid = processes.get(k);
            killProcess(conn, pid);
          }
        }
      }
    });
  });
}

module.exports = handleSIGINT;