const { executeSQL } = require("./database");
const { addUser } = require("./user");
const { getActiveClientNames } = require("./websocketserver");

const getUsers = async (req, res) => { 
  try {
    const result = await executeSQL("SELECT name FROM users;");
    const users = result.map((row) => row.name);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await executeSQL("SELECT message, time FROM messages;");
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addNewMessage = async (message, time) => {
  try {
    const values = [message, time];
    await executeSQL("INSERT INTO messages (user_id, message, time) VALUES ('1', ?, ?)", values);
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

const getActiveClientNamesHandler = async (req, res) => {
  try {
    const activeClientNames = getActiveClientNames();
    res.json(activeClientNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const initializeAPI = (app) => {
  app.get("/api/users", getUsers);
  app.get("/api/messages", getMessages);
  app.post("/api/users", addUser);
  app.post("/api/messages", addNewMessage);
  app.get("/api/active", getActiveClientNamesHandler);
};

module.exports = { initializeAPI, addUser, addNewMessage };
