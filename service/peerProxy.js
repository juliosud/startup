const { WebSocketServer } = require('ws');

function peerProxy(httpServer) {
  // Create a websocket object
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;

    // Forward messages to everyone except the sender
    socket.on('message', function message(data) {
      socketServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });

    // Respond to pong messages by marking the connection alive
    socket.on('pong', () => {
      socket.isAlive = true;
      console.log('pong'); //TEST --------------
    });
  });

  // Periodically send out a ping message to make sure clients are alive
  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) return client.terminate();

      client.isAlive = false;
      client.ping();
      console.log('ping'); //TEST --------------
    });
  }, 10000);
}

module.exports = { peerProxy };