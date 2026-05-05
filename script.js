const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');


function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message', `${sender}-message`);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = sender === 'bot' ? '🤖' : '👩🏾';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;

    message.appendChild(avatar);
    message.appendChild(bubble);
    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typing = document.createElement('div');
    typing.classList.add('message', 'bot-message', 'typing');
    typing.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = '🤖';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    typing.appendChild(avatar);
    typing.appendChild(bubble);
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';

    const sendBtn = document.querySelector('.send-btn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    showTyping();

    try {
        const response = await fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        hideTyping();
        addMessage(data.reply, 'bot');

    } catch (error) {
        hideTyping();
        addMessage('Sorry, I could not connect to the server. Make sure the backend is running!', 'bot');
    }

    sendBtn.disabled = false;
    sendBtn.textContent = 'Send ➤';
}

function handleKey(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function clearChat() {
    chatBox.innerHTML = `
        <div class="message bot-message">
            <div class="avatar">🤖</div>
            <div class="bubble">
                Hi! I'm your AI Assistant. How can I help you today? 😊
            </div>
        </div>
    `;
}

function handleKey(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function clearChat() {
    chatBox.innerHTML = `
        <div class="message bot-message">
            <div class="avatar">🤖</div>
            <div class="bubble">
                Hi! I'm your AI Assistant. How can I help you today? 😊
            </div>
        </div>
    `;
}