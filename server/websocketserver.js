const WebSocket = require("ws");
const { addUser }  = require("./api");
const clients = new Set();

// Initialite the WebSocketserver
const initializeWebsocketServer = (server) => {
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", (ws, req) => onConnection(ws, req));
};

async function onConnection(ws, req) {
  ws.result = {};

  let result;
  console.log("New WebSocket Connection");

  try {
    result = await addUser(req);
    if (result.success) {
      ws.send(result.message);
      ws.result.message = result.message;
    } else {
      ws.send("Error by adding the User");
    }
  } catch (error) {
    console.error(error);
  }
  clients.add(ws);
  const activeUsers = getActiveUsers();
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: "active_users",
        data: activeUsers
      }));
    }
  }
  ws.on("message", (blob) => {
    const message = blob.toString();
    console.log("New Message From "+ ws.result.message + ": " + message); // Greife auf die result-Eigenschaft des WebSocket-Objekts zu
  
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(ws.result.message + ":] " + message);
      }
    }
  });
  ws.on("close", () => {
    clients.delete(ws);
    const activeUsers = getActiveUsers();
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: "active_users",
          data: activeUsers
        }));
      }
    }
  });
}

function getActiveUsers() {
  const activeUsers = [];
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      const user = client.result ? client.result.message : "Unknown User";
      activeUsers.push(user);
    }
  }
  return activeUsers;
}

module.exports = { initializeWebsocketServer };
