const { initializeMariaDB, initializeDBSchema, executeSQL} = require("../server/database");

const editButton = document.getElementById("edit_button");
editButton.addEventListener("click", () => {
  // Code to be executed when the button is clicked
  (async function () {
    // Initialize the database
    await initializeMariaDB();
    await initializeDBSchema();
    // TODO: REMOVE!!!! test the database connection
    const result = await executeSQL("SELECT * FROM users;");
    console.log(result);
  })();  
});
