const WebSocket = require("ws");
const clients = new Set();

// Intiiate the websocket server
const initializeWebsocketServer = (server) => {
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", onConnection);
};

// If a new connection is established, the onConnection function is called
function onConnection(ws) {
  console.log("New websocket connection");
  clients.add(ws);
  ws.on("message", (blob) => {
    const message = blob.toString();
    console.log("Message received: " + message);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });
  ws.on("close", () => {
    clients.delete(ws);
  });
}

  
// If a new message is received, the onMessage function is called
function onMessage(ws, message) {
  console.log("Message received: " + message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}


module.exports = { initializeWebsocketServer, onMessage };