const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// luam username si room din URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
  addRoomNameToDom(room);
  addUsersToDom(users);
});

socket.on('message', (message) => {
  addMessageToDom(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  console.log(message);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function addMessageToDom(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

function addRoomNameToDom(room) {
  roomName.innerText = room;
}

function addUsersToDom(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Doriti sa plecati?');
  if (leaveRoom) {
    window.location = '../index.html';
  }
});
