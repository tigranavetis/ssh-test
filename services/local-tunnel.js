const net = require('net');

function createLocalTunnel(conn, fromPort, remoteHost, toPort, localhost = 'localhost') {
  net.createServer(socket => {
    conn.forwardOut(localhost, fromPort, remoteHost, toPort, (err, stream) => {
      if (err) throw err;
      socket.pipe(stream);
      stream.pipe(socket);
    });
  }).listen(fromPort, localhost, () => {
    console.log('Listening on the port:', fromPort);
  });
}

module.exports = createLocalTunnel;