const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', (event) => {
    console.log('WebSocket connected!');
});

socket.addEventListener('message', (event) => {
    const chatWindow = document.getElementById('chatWindow');
    const message = document.createElement('div');
    message.innerText = `[${new Date().toLocaleTimeString()}] ${event.data}`;
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