const { executeSQL } = require("./database");

const initializeAPI = (app) => {
  app.get("/api/users", getUsers);
  app.get("/api/messages", getMessages);
  app.post("/api/users", addUser);
  app.post("/api/messages", addMessage);
};

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

const addUser = async (req, res) => {
  try {
    const randomName = "quest" + Math.floor(Math.random() * 1000);
    await executeSQL(`INSERT INTO users (name) VALUES ("${randomName}")`);
    res.sendStatus(201); // send a 201 status code to indicate success
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const time = new Date().toISOString();
    await executeSQL(`INSERT INTO messages (message, time) VALUES ('${message}', '${time}')`);
    const result = await executeSQL(`SELECT * FROM messages WHERE time = '${time}'`);
    const newMessage = result[0];
    res.status(201).json(newMessage); // send the new message data as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { initializeAPI, addUser };
