const socket = new WebSocket('ws://localhost:3000');

function addMessage(message) {
  const chatWindow = document.getElementById("chatWindow");
  const messageNode = document.createElement("div");

  const timeNode = document.createElement("span");
  timeNode.classList.add("message-time");
  timeNode.textContent = `${message.time} `;
  messageNode.appendChild(timeNode);

  const messageContentNode = document.createElement("span");
  messageContentNode.classList.add("message-content");
  messageContentNode.textContent = message.message;
  messageNode.appendChild(messageContentNode);

  chatWindow.appendChild(messageNode);
}

async function displayMessages() {
  const response = await fetch("/api/messages");
  const messages = await response.json();
  messages.forEach((message) => {
    addMessage(message);
  });
}

displayMessages();

socket.addEventListener('open', (event) => {
  console.log('WebSocket connected!');
});

socket.addEventListener('message', (event) => {
  const chatWindow = document.getElementById('chatWindow');
  const message = document.createElement('div');
  const time = new Date().toLocaleTimeString();
  message.innerText = `[${time} ${event.data}`;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.addEventListener('error', (event) => {
  console.error('WebSocket error:', event);
});

document.getElementById('messageForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('messageInput');
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(input.value);
    input.value = '';
  }
});

const questsDiv = document.getElementById("quests");

function updateActiveUsersList(activeUsers) {
  const numUsers = activeUsers.length;
  const list = document.createElement("ul");
  let usersString = "";
  for (let i = 0; i < numUsers; i++) {
    const user = activeUsers[i];
    usersString += user;
    if (i < numUsers - 1) {
      usersString += ", ";
    }
  }
  const usersElement = document.createElement("div");
  usersElement.textContent = usersString;
  list.appendChild(usersElement);

  const widthPercentage = 100 * usersElement.offsetWidth / window.innerWidth;
  if (widthPercentage > 80) {
    const newLine = document.createElement("br");
    list.appendChild(newLine);
  }

  questsDiv.innerHTML = "";
  questsDiv.appendChild(list);
}

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "active_users") {
    updateActiveUsersList(data.data);
  }
});

const nameInput = document.getElementById("name-input");
const nameSubmitButton = document.getElementById("name-submit-button");

nameSubmitButton.addEventListener("click", async () => {
  const newName = nameInput.value;
  const response = await fetch(`/api/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: newName
    })
  });
  if (response.ok) {
    // Update the user's name in the UI
    const userNameElement = document.getElementById("user-name");
    userNameElement.innerText = newName;
    // Display success message
    console.log("Name updated successfully!");
  } else {
    // Display error message
    console.error("Error updating name:", response.statusText);
  }
});
