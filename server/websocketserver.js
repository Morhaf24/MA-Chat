const WebSocket = require("ws");
const { addUser }  = require("./user");

const clients = new Set();

// Initiate the websocket server
const initializeWebsocketServer = (server) => {
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", (ws, req) => onConnection(ws, req));
};

async function onConnection(ws, req) {
  let result;
  try {
    result = await addUser(req);
    if (result.success) {
      ws.send(result.message);
      ws.name = result.name; // set the client name
    } else {
      ws.send("Error adding user");
    }
  } catch (error) {
    console.error(error);
  }
  clients.add(ws);
  ws.on("message", (blob) => {
    const message = blob.toString();
    console.log("[Message received from "+ ws.name + ": " + message);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        const name = client.name;
        client.send(name + ": " + message);
      }
    }
  });
  ws.on("close", () => {
    clients.delete(ws);
  });
}

function getActiveClients() {
  const activeClients = [...clients];
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      activeClients.push(client);
    }
  }
  return activeClients;
}

function getActiveClientNames() {
  const activeClients = [...clients].filter(client => client.readyState === WebSocket.OPEN);
  const activeNames = activeClients.map((client) => client.name);
  console.log(activeNames);
  return activeNames;
}

module.exports = { initializeWebsocketServer, clients, getActiveClientNames };
