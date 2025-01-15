let socket;
let currentBonzi;

document.addEventListener('DOMContentLoaded', () => {
  const loginGo = document.getElementById('login_go');
  const loginName = document.getElementById('login_name');
  const loginRoom = document.getElementById('login_room');
  const loginError = document.getElementById('login_error');
  const loginLoad = document.getElementById('login_load');
  
  socket = io('https://bonzi.nigger.email');

  socket.on('login', (data) => {
    document.body.classList.remove('blur');
    $('#page_login').hide();
    $('#content').show();
    
    $('#room_priv').text(data.roompriv ? 'private' : 'public');
    if (data.owner) $('#room_owner').show();

    currentBonzi = new Bonzi({
      id: socket.id,
      name: data.name,
      room: data.room,
      color: ['black', 'blue', 'brown', 'green', 'purple', 'red'][
        Math.floor(Math.random() * 6)
      ]
    });
  });

  socket.on('join', (data) => {
    new Bonzi(data);
  });

  socket.on('leave', (guid) => {
    $(`#bonzi_${guid}`).find('.sprite').trigger('surf_away');
    setTimeout(() => {
      $(`#bonzi_${guid}`).remove();
    }, 1000);
  });

  socket.on('talk', (data) => {
    const bonzi = $(`#bonzi_${data.guid}`).data('bonzi');
    if (bonzi) {
      bonzi.speak(data.text);
    }
  });

  socket.on('update', (data) => {
    const bonzi = $(`#bonzi_${data.guid}`).data('bonzi');
    if (bonzi) {
      Object.assign(bonzi, data);
      bonzi.$nametag.text(data.name);
    }
  });

  loginGo.addEventListener('click', handleLogin);
  loginName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  loginRoom.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  $('#chat_send').on('click', () => {
    const message = $('#chat_message').val().trim();
    if (message) {
      socket.emit('talk', { text: message });
      $('#chat_message').val('');
    }
  });

  $('#chat_message').on('keypress', (e) => {
    if (e.key === 'Enter') {
      $('#chat_send').click();
    }
  });

  function handleLogin() {
    const name = loginName.value.trim();
    const room = loginRoom.value.trim();

    if (!name) {
      showError('Name cannot be empty!');
      return;
    }

    if (name.length > 25) {
      showError('Name too long! (25 char. max)');
      return;
    }

    if (room.length > 20) {
      showError('Room ID too long! (20 char. max)');
      return;
    }

    document.body.classList.add('blur');
    loginLoad.style.display = 'block';
    
    socket.emit('login', {
      name: name,
      room: room
    });
  }

  function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
    setTimeout(() => {
      loginError.style.display = 'none';
    }, 3000);
  }
});