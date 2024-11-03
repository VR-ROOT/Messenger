$(document).ready(function() {
    let userName;
    let roomID = Math.random().toString(36).substr(2, 9);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('room')) {
        roomID = urlParams.get('room');
        userName = prompt("Enter your name to join the chat:");
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
        if (e.which === 13) sendMessage();
    });

    $('#copyButton').on('click', function() {
        navigator.clipboard.writeText($('#inviteLink').val()).then(() => {
            alert('Invite link copied to clipboard!');
        });
    });

    function joinChat() {
        $('#joinContainer').hide();
        $('#chatContainer').show();
        $('#messages').append(createMessage(userName, "joined the chat", "received"));
        loadMessages();
        generateInviteLink();
        setInterval(loadMessages, 2000);
    }

    function sendMessage() {
        const message = $('#messageInput').val();
        if (message) {
            const timestamp = new Date().toLocaleTimeString();
            const msgObject = { name: userName, message: message, timestamp: timestamp };
            $('#messages').append(createMessage(userName, message, "sent", timestamp));
            $('#messageInput').val('');
            saveMessage(msgObject);
            scrollToBottom();
        }
    }

    function saveMessage(msgObject) {
        let messages = JSON.parse(localStorage.getItem('chatMessages')) || {};
        if (!messages[roomID]) messages[roomID] = [];
        messages[roomID].push(msgObject);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }

    function loadMessages() {
        let messages = JSON.parse(localStorage.getItem('chatMessages')) || {};
        $('#messages').empty();
        if (messages[roomID]) {
            messages[roomID].forEach(msg => {
                $('#messages').append(createMessage(msg.name, msg.message, msg.name === userName ? 'sent' : 'received', msg.timestamp));
            });
        }
        scrollToBottom();
    }

    function generateInviteLink() {
        const inviteLink = window.location.href.split('?')[0] + '?room=' + roomID;
        $('#inviteLink').val(inviteLink).show();
        $('#copyButton').show();
    }

    function createMessage(name, text, type, timestamp) {
        return `<div class="message ${type}">${text}<span class="timestamp">${timestamp}</span></div>`;
    }

    function scrollToBottom() {
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    }
});
