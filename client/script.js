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

