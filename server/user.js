const { executeSQL } = require("./database");

const addUser = async (req) => {
  try {
    const randomName = "quest" + Math.floor(Math.random() * 10000);
    await executeSQL(`INSERT INTO users (name) VALUES ("${randomName}")`);
    console.log(`${randomName} joined`);
    return { success: true, message: `${randomName}` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error adding user" };
  }
};

module.exports = { addUser } ;
