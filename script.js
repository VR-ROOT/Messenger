
$(document).ready(function() {
    let userName;
    let roomID = Math.random().toString(36).substr(2, 9); // Generate a random room ID

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('room')) {
        roomID = urlParams.get('room'); // Get room ID from URL
        userName = prompt("Enter your name to join the chat:"); // Prompt for name
        if (userName) {
            joinChat();
        }
    }

    $('#joinButton').on('click', function() {
        userName = $('#nameInput').val();
        if (userName) {
            joinChat();
        } else {
            alert('Please enter your name');
        }
    });

    $('#sendButton').on('click', function() {
        sendMessage();
    });

    $('#messageInput').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            sendMessage();
        }
    });

    $('#copyButton').on('click', function() {
        const inviteLink = $('#inviteLink').val();
        navigator.clipboard.writeText(inviteLink).then(() => {
            alert('Invite link copied to clipboard!');
        });
    });

    function joinChat() {
        $('#joinContainer').hide();
        $('#chatContainer').show();
        $('#messages').append('<div><strong>' + userName + '</strong> joined the chat</div>');
        loadMessages();
        generateInviteLink();
        setInterval(loadMessages, 2000); // Load messages every 2 seconds
    }

    function sendMessage() {
        const message = $('#messageInput').val();
        if (message) {
            const timestamp = new Date().toLocaleTimeString();
            const msgObject = { name: userName, message: message, timestamp: timestamp };
            $('#messages').append('<div><strong>' + userName + ':</strong> ' + message + ' <small>(' + timestamp + ')</small></div>');
            $('#messageInput').val('');
            saveMessage(msgObject);
            scrollToBottom();
        }
    }

    function saveMessage(msgObject) {
        let messages = JSON.parse(localStorage.getItem('chatMessages')) || {};
        if (!messages[roomID]) {
            messages[roomID] = [];
        }
        messages[roomID].push(msgObject);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }

    function loadMessages() {
        let messages = JSON.parse(localStorage.getItem('chatMessages')) || {};
        $('#messages').empty(); // Clear current messages
        if (messages[roomID]) {
            messages[roomID].forEach(msg => {
                $('#messages').append('<div><strong>' + msg.name + ':</strong> ' + msg.message + ' <small>(' + msg.timestamp + ')</small></div>');
            });
        }
        scrollToBottom();
    }

    function generateInviteLink() {
        const inviteLink = window.location.href.split('?')[0] + '?room=' + roomID; // Generate invite link
        $('#inviteLink').val(inviteLink);
        $('#inviteLink').show();
        $('#copyButton').show();
    }

    function scrollToBottom() {
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    }
});
