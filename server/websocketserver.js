const WebSocket = require("ws");
const { addUser }  = require("./api");
const clients = new Set();

// Initialite the WebSocketserver
const initializeWebsocketServer = (server) => {
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", async (ws, req) => {
    ws.result = {};

    try {
      const result = await addUser(req);
      if (result.success) {
        ws.send(result.message);
        ws.result.message = result.message;
        ws.user = { name: result.username };
        console.log(`${ws.user.name} joined`);
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
      console.log(`New Message From ${ws.user.name}: ${message}`);
  
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${ws.user.name}:] ${message}`);
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
  });
};


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
