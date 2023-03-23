const { executeSQL } = require("./database");

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
  const myName = req.websocket.user.name;
  const newName = req.body.name;
  try {
    const result = await executeSQL(`UPDATE users SET name = '${newName}' WHERE name = '${myName}'`);
    console.log(`${myName} changed name to ${newName}`);
    res.sendStatus(200);
    return { success: true, message: `Name changed to ${newName}` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error changing name" };
  }
};

const initializeAPI = (app) => {
  app.get("/api/users", getUsers);
  app.get("/api/messages", getMessages);
  app.post("/api/users", addUser);
  app.post("/api/messages", addNewMessage);
  app.put("/api/user", updateUser);
};

module.exports = { initializeAPI, addUser, addNewMessage };
