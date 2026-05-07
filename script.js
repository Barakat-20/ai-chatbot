const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let isTyping = false;

// ── AUTO RESIZE TEXTAREA ──
function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

// ── HANDLE ENTER KEY ──
function handleKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// ── REMOVE WELCOME SCREEN ──
function removeWelcome() {
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.remove();
}

// ── USE SUGGESTION ──
function useSuggestion(text) {
    userInput.value = text;
    autoResize(userInput);
    sendMessage();
}

// ── ADD MESSAGE ──
function addMessage(text, sender) {
    removeWelcome();

    const row = document.createElement('div');
    row.classList.add('message-row', sender);

    const avatar = document.createElement('div');
    avatar.classList.add('msg-avatar');
    avatar.textContent = sender === 'bot' ? 'CF' : '👤';

    const content = document.createElement('div');
    content.classList.add('msg-content');

    const bubble = document.createElement('div');
    bubble.classList.add('msg-bubble');
    bubble.textContent = text;

    content.appendChild(bubble);

    // Add copy button for bot messages
    if (sender === 'bot') {
        const actions = document.createElement('div');
        actions.classList.add('msg-actions');

        const copyBtn = document.createElement('button');
        copyBtn.classList.add('action-btn');
        copyBtn.innerHTML = '📋 Copy';
        copyBtn.onclick = () => copyText(text, copyBtn);

        actions.appendChild(copyBtn);
        content.appendChild(actions);
    }

    row.appendChild(avatar);
    row.appendChild(content);
    chatBox.appendChild(row);
    scrollToBottom();
}

// ── COPY TEXT ──
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '✅ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = '📋 Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// ── SHOW TYPING ──
function showTyping() {
    const row = document.createElement('div');
    row.classList.add('message-row', 'bot');
    row.id = 'typingRow';

    const avatar = document.createElement('div');
    avatar.classList.add('msg-avatar');
    avatar.textContent = 'CF';

    const content = document.createElement('div');
    content.classList.add('msg-content');

    const bubble = document.createElement('div');
    bubble.classList.add('typing-bubble');
    bubble.innerHTML = '<span></span><span></span><span></span>';

    content.appendChild(bubble);
    row.appendChild(avatar);
    row.appendChild(content);
    chatBox.appendChild(row);
    scrollToBottom();
}

// ── HIDE TYPING ──
function hideTyping() {
    const row = document.getElementById('typingRow');
    if (row) row.remove();
}

// ── SCROLL TO BOTTOM ──
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ── SEND MESSAGE ──
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || isTyping) return;

    addMessage(message, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    isTyping = true;
    sendBtn.disabled = true;
    showTyping();

    try {
        const response = await fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        hideTyping();
        addMessage(data.reply, 'bot');

    } catch (error) {
        hideTyping();
        addMessage('Sorry, I could not connect to the server. Make sure the backend is running!', 'bot');
    }

    isTyping = false;
    sendBtn.disabled = false;
    scrollToBottom();
}

// ── CLEAR CHAT ──
async function clearChat() {
    try {
        await fetch('http://127.0.0.1:8000/clear', { method: 'POST' });
    } catch (e) {}

    chatBox.innerHTML = `
        <div class="welcome" id="welcomeScreen">
            <div class="welcome-logo">CF</div>
            <h1 class="welcome-title">How can I help you today?</h1>
            <p class="welcome-sub">ChatFai is your intelligent AI assistant — powered by Llama 3.3</p>
            <div class="suggestions">
                <div class="suggestion" onclick="useSuggestion('Explain how the internet works')">
                    <span class="sug-icon">🌐</span>
                    <span>Explain how the internet works</span>
                </div>
                <div class="suggestion" onclick="useSuggestion('Write a Python function to sort a list')">
                    <span class="sug-icon">🐍</span>
                    <span>Write a Python function to sort a list</span>
                </div>
                <div class="suggestion" onclick="useSuggestion('What are the best practices for REST APIs?')">
                    <span class="sug-icon">⚡</span>
                    <span>Best practices for REST APIs</span>
                </div>
                <div class="suggestion" onclick="useSuggestion('Help me debug my JavaScript code')">
                    <span class="sug-icon">🔧</span>
                    <span>Help me debug my JavaScript code</span>
                </div>
            </div>
        </div>
    `;
}
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}