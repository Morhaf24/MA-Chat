const { executeSQL } = require("./database");

const initializeAPI = (app) => {
  app.get("/api/users", getUsers);
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

module.exports = { initializeAPI };
