const WebSocket = require("ws");
const { addUser }  = require("./api");
const clients = new Set();

// Initiate the websocket server
const initializeWebsocketServer = (server) => {
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", (ws, req) => onConnection(ws, req));
};

async function onConnection(ws, req) {
  let result; // define result variable outside try block
  console.log("New websocket connection");
  try {
    result = await addUser(req);
    if (result.success) {
      ws.send(result.message);
    } else {
      ws.send("Error adding user");
    }
  } catch (error) {
    console.error(error);
  }
  clients.add(ws);
  ws.on("message", (blob) => {
    const message = blob.toString();
    console.log("Message received from "+ result.message + ": " + message); // use result variable here
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(result.message + ": " + message); // include sender name in message sent to clients
      }
    }
  });
  ws.on("close", () => {
    clients.delete(ws);
  });
}


module.exports = { initializeWebsocketServer };
