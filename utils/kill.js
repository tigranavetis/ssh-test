function killProcess(conn, pid) {
  const killProcessByID = `kill -9 ${pid}`;
    
  conn.exec(killProcessByID, (err, stream) => {
    if (err) {
      console.error(err);
      stream.end('exit\n');
    }

    stream.close();
  });
}

module.exports = killProcess;