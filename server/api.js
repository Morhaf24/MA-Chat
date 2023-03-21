const { executeSQL } = require("./database");

const initializeAPI = (app) => {
  app.get("/api/users", getUsers);
  app.get("/api/messages", getMessages);
  app.post("/api/users", addUser);
  app.post("/api/messages", addNewMessage);
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

const addUser = async (req) => {
  try {
    const randomName = "quest" + Math.floor(Math.random() * 10000);
    await executeSQL(`INSERT INTO users (name) VALUES ("${randomName}")`);
    console.log(`${randomName}`);
    return { success: true, message: `${randomName}]` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};


const addNewMessage = async (message, time) => {
  try {
    await executeSQL(`INSERT INTO messages (user_id, message, time) VALUES ('1', '${message}', '${time}')`);$
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

module.exports = { initializeAPI, addUser, addNewMessage };
