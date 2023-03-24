const { executeSQL } = require("./database");
const { initializeWebsocketServer } = require('./websocketserver');

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

const addUser = async (req) => {
  try {
    const randomName = "quest" + Math.floor(Math.random() * 10000);
    await executeSQL(`INSERT INTO users (name) VALUES ("${randomName}")`);
    const result = await executeSQL("SELECT name FROM users ORDER BY id DESC LIMIT 1");
    const username = result[0].name;
    console.log(`${username} joined`);
    return { success: true, message: `${username}`, username };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error adding user", username: null };
  }
};


const updateUser = async (req, res) => {
  const oldName = req.body.oldName; 
  const newName = req.body.newName; 
  try {
    const result = await executeSQL(`UPDATE users SET name = '${newName}' WHERE name = '${oldName}'`);
    console.log(`${oldName} changed name to ${newName}`);
    return { success: true, message: `${newName}`, newName };
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error changing name" });
  }
};

const initializeAPI = (app) => {
  app.get("/api/users", getUsers);
  app.get("/api/messages", getMessages);
  app.post("/api/users", addUser);
  app.post("/api/messages", addNewMessage);
  app.put("/api/user", updateUser);
};

module.exports = { initializeAPI, addUser, addNewMessage, updateUser };