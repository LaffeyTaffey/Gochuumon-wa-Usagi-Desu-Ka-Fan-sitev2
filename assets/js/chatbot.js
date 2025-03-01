const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatContainer = document.getElementById('chat-container');

// Function to get the current base URL dynamically
function getBaseURL() {
    // Use the current origin to make the URL dynamic
    return window.location.origin;
}

// Function to append messages to the chat
function appendMessage(sender, message, options = {}) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    // Determine the alignment based on the sender
    if (sender === 'You') {
        messageDiv.classList.add('user-message'); // User messages on the right
        messageDiv.style.textAlign = 'right'; // Align user messages to the right
    } else {
        messageDiv.classList.add('chino-message'); // Chino's messages on the left
        messageDiv.style.textAlign = 'left'; // Align Chino's messages to the left
    }

    // Create profile picture
    const profilePic = document.createElement('img');
    profilePic.classList.add('message-profile');
    profilePic.src = sender === 'You'
        ? 'assets/img/chinochat/user_profile.webp'
        : 'assets/img/chinochat/profile_chino.webp';

    // Create message content with streaming effect
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    // Create action buttons container
    const actionButtonsDiv = document.createElement('div');
    actionButtonsDiv.classList.add('message-actions');

    // Regenerate button for Chino's messages
    if (sender !== 'You') {
        const regenerateBtn = document.createElement('button');
        regenerateBtn.innerHTML = '🔄';
        regenerateBtn.classList.add('regenerate-btn');
        regenerateBtn.addEventListener('click', () => {
            if (lastUserMessage) {
                userInput.value = lastUserMessage;
                sendBtn.click();
            }
        });
        actionButtonsDiv.appendChild(regenerateBtn);
    }

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.classList.add('edit-btn');

    // Make content editable on edit button click
    let isEditing = false;
    editBtn.addEventListener('click', () => {
        if (!isEditing) {
            // Enable editing
            contentDiv.setAttribute('contenteditable', 'true');
            contentDiv.focus();
            editBtn.innerHTML = '💾';
            isEditing = true;
        } else {
            // Save edited content
            contentDiv.removeAttribute('contenteditable');
            editBtn.innerHTML = '✏️';
            isEditing = false;

            // Update the message content
            const editedMessage = contentDiv.innerText;

            // If it's a user message, update the input
            if (sender === 'You') {
                userInput.value = editedMessage;
            }
        }
    });
    actionButtonsDiv.appendChild(editBtn);

    function streamText(text) {
        const htmlText = convertMarkdownToHTML(text);
        contentDiv.innerHTML = ''; // Reset content

        let i = 0;
        const typing = setInterval(() => {
            if (i < htmlText.length) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlText.slice(0, i + 1);

                contentDiv.innerHTML = tempDiv.innerHTML;
                i++;
            } else {
                clearInterval(typing);
            }
        }, 30);
    }

    // Stream the markdown-converted text
    streamText(message);

    // Append elements based on sender
    if (sender === 'You') {
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(actionButtonsDiv);
        messageDiv.appendChild(profilePic);
    } else {
        messageDiv.appendChild(profilePic);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(actionButtonsDiv);
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// markdown conversion function
function convertMarkdownToHTML(text) {
    // Order matters - do bold before italic to prevent conflicts
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    text = text.replace(/\*(.*?)\*/g, '<i>$1</i>');
    text = text.replace(/_(.*?)_/g, '<u>$1</u>');
    text = text.replace(/~(.*?)~/g, '<strike>$1</strike>');
    return text;
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

let lastUserMessage = '';
let lastBotResponse = '';
let apiStatus = 'offline';

// Function to check API status
async function checkAPIStatus() {
    const apiStatusElement = document.getElementById('api-status');
    try {
        console.log('Attempting to check API status...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${getBaseURL()}/api-status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('API Status Response:', response);

        if (response.ok) {
            const data = await response.json();
            apiStatus = 'online';
            console.log('API Status Data:', data);

            if (apiStatusElement) {
                apiStatusElement.classList.remove('offline');
                apiStatusElement.classList.add('online');
                apiStatusElement.title = data.message || 'API Online';
            }
            return true;
        } else {
            console.error('API Status Check Failed:', {
                status: response.status,
                statusText: response.statusText
            });

            apiStatus = 'offline';
            if (apiStatusElement) {
                apiStatusElement.classList.remove('online');
                apiStatusElement.classList.add('offline');
                apiStatusElement.title = 'API Offline';
            }
            return false;
        }
    } catch (error) {
        console.error('Comprehensive API Status Check Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        // Log detailed error to server
        try {
            await fetch(`${getBaseURL()}/log-error`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: error.message,
                    stack: error.stack,
                    context: 'API Status Check',
                    timestamp: new Date().toISOString()
                })
            });
        } catch (logError) {
            console.error('Error logging failed:', logError);
        }

        apiStatus = 'offline';
        if (apiStatusElement) {
            apiStatusElement.classList.remove('online');
            apiStatusElement.classList.add('offline');
            apiStatusElement.title = 'API Offline';
        }
        return false;
    }
}

let currentUserId = null;

// Function to handle login
document.getElementById('login-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        currentUserId = data.userId; // Set the current user ID
        document.getElementById('chat-username').innerText = `${username}`; // Update the username in the header
        toggleLoginSystem(); // Hide login container
        chatContainer.style.display = 'block'; // Show chat container
        loadChatHistory(); // Load chat history for the new user

        // Enable buttons
        document.getElementById('user-profile-btn').disabled = false;
        document.getElementById('delete-chat-btn').disabled = false;

        // Display the initial welcome message
        appendMessage('Chino', '*bows* Welcome to Rabbit House Café. *stares at you* oh its you again *smiles sweetly*');
    } else {
        showNotification('Login failed');
    }
});


// Function to show/hide login/registration system with animation
function toggleLoginSystem() {
    const loginContainer = document.getElementById('login-container');
    if (loginContainer.style.display === 'none' || loginContainer.style.display === '') {
        loginContainer.style.display = 'flex';
        loginContainer.style.animation = 'fadeIn 0.5s ease-in-out';
    } else {
        loginContainer.style.display = 'none';
        loginContainer.style.animation = 'fadeOut 0.5s ease-in-out';
    }
}

// Add event listener to the FA icon
document.getElementById('user-icon').addEventListener('click', toggleLoginSystem);

// Function to handle registration
document.getElementById('register-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        showNotification('Registration successful! Logging you in...');

        // Automatically log in the user after registration
        const loginResponse = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (loginResponse.ok) {
            const data = await loginResponse.json();
            currentUserId = data.userId; // Set the current user ID
            document.getElementById('chat-username').innerText = `${username}`; // Update the username in the header
            toggleLoginSystem(); // Hide login container
            chatContainer.style.display = 'block'; // Show chat container
            loadChatHistory(); // Load chat history for the new user

            // Display the initial welcome message
            appendMessage('Chino', '*bows* Welcome to Rabbit House Café. *stares at you* oh its you again *smiles sweetly*');
        } else {
            showNotification('Login failed after registration');
        }
    } else {
        showNotification('Registration failed');
    }
});

// Function to save chat message
async function saveChatMessage(message, sender) {
    if (!currentUserId) return;

    await fetch('/save-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, message, sender })
    });
}

// Function to load chat history
async function loadChatHistory() {
    if (!currentUserId) return;

    // Clear previous messages
    messagesContainer.innerHTML = '';

    const response = await fetch(`/chat-history/${currentUserId}`);
    if (response.ok) {
        const history = await response.json();
        history.forEach(msg => {
            appendMessage(msg.sender, msg.message);
        });
    }
}

function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('chinochat-notification-container');
    const notification = document.createElement('div');
    notification.classList.add('chinochatnotification');
    notification.textContent = message;

    // Add type-specific styling if needed
    if (type === 'error') {
        notification.style.backgroundColor = '#ff6b6b';
        notification.style.color = '#fff';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = '#fff';
    }

    notificationContainer.appendChild(notification);

    // Remove the notification after the animation ends
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to handle logout
function logout() {
    currentUserId = null; // Clear the current user ID
    messagesContainer.innerHTML = ''; // Clear chat messages
    chatContainer.style.display = 'none'; // Hide chat container
    toggleLoginSystem(); // Show login container

    // Clear the username display
    document.getElementById('chat-username').innerText = ''; // Clear the username

    // Disable buttons
    document.getElementById('user-profile-btn').disabled = true;
    document.getElementById('delete-chat-btn').disabled = true;

    // Display the initial welcome message
    appendMessage('Chino', '*bows* Welcome to Rabbit House Café. *stares at you* oh its you again *smiles sweetly*');
}

// Add event listener to the logout button
document.getElementById('logout-btn').addEventListener('click', logout);

// Add event listener to the close button
document.getElementById('close-login-btn').addEventListener('click', () => {
    document.getElementById('login-container').style.display = 'none'; // Hide the login container
});

document.getElementById('user-profile-btn').addEventListener('click', () => {
    window.location.href = 'profile.html'; // Redirect to profile.html
});

// Function to delete chat
async function deleteChat() {
    if (!currentUserId) return;

    const response = await fetch(`/delete-chat/${currentUserId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        showNotification('Chat history deleted');
        messagesContainer.innerHTML = ''; // Clear chat UI
    } else {
        showNotification('Failed to delete chat history');
    }
}

// Add event listener to delete chat button
document.getElementById('delete-chat-btn').addEventListener('click', deleteChat);

sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    // Function to select a random audio file with a higher chance for notification.mp3
    function getRandomAudioFile() {
        const audioFiles = [
            'assets/audio/Notifications/notification.mp3', // rare one
            ...Array.from({ length: 17 }, (_, i) => `assets/audio/Notifications/notif${i + 1}.wav`) // notif1.wav to notif17.wav
        ];
        const randomNum = Math.random();
        // 20% chance to select notification.mp3, 80% chance to select one of the other sounds
        if (randomNum < 0.2) {
            return audioFiles[0]; // notification.mp3
        } else {
            const randomIndex = Math.floor(Math.random() * (audioFiles.length - 1)) + 1; // avoid the first element
            return audioFiles[randomIndex];
        }
    }

    // Store last user message
    lastUserMessage = message;

    // Display the user's message
    appendMessage('You', message);
    await saveChatMessage(message, 'You'); // Save user message
    userInput.value = '';

    // Show thinking phase
    const thinkingPhase = document.getElementById('thinking-phase');
    const estimatedTimeElement = document.querySelector('.estimated-time');
    const apiStatusElement = document.createElement('div');
    apiStatusElement.id = 'api-status';

    // Check API status
    try {
        const response = await fetch(`${getBaseURL()}/api-status`);
        if (response.ok) {
            apiStatusElement.classList.add('online');
            apiStatusElement.title = 'API Online';
        } else {
            apiStatusElement.classList.add('offline');
            apiStatusElement.title = 'API Offline';
        }
    } catch (error) {
        apiStatusElement.classList.add('offline');
        apiStatusElement.title = 'API Offline';
    }

    // Add API status to thinking phase
    thinkingPhase.appendChild(apiStatusElement);
    thinkingPhase.style.display = 'flex';

    // Estimate response time
    const estimatedTime = Math.floor(Math.random() * (20 - 10 + 1)) + 15; // Random time
    estimatedTimeElement.textContent = `Estimated response time: ${estimatedTime} seconds`;

    // Send the message to the server
    const startTime = Date.now();
    fetch(`${getBaseURL()}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
        .then((response) => {
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(async (botResponse) => { // Change to async to use await
            const endTime = Date.now();
            const actualResponseTime = ((endTime - startTime) / 1000).toFixed(2);

            // Hide thinking phase
            thinkingPhase.style.display = 'none';
            // Remove API status element
            apiStatusElement.remove();

            // Store last bot response
            lastBotResponse = botResponse;

            // Display the bot's response
            appendMessage('Chino', botResponse);

            // Save the bot's response to the database
            await saveChatMessage(botResponse, 'Chino'); // Save bot message

            // Create and add notification emoji
            const chatBubble = document.querySelector('.chat-bubble');
            const notificationEmoji = document.createElement('div');
            notificationEmoji.classList.add('notification-emoji');
            notificationEmoji.textContent = '1';

            // Select a random sound
            const soundFile = getRandomAudioFile();
            const pingSound = new Audio(soundFile);
            pingSound.play();

            // Add to chat bubble
            chatBubble.appendChild(notificationEmoji);

            setTimeout(() => {
                notificationEmoji.remove();
            }, 5000);

            console.log('Web Scraping Context:', botResponse);
        })
        .catch((error) => {
            console.error('Error communicating with the chatbot:', error);

            // Log detailed error to server
            fetch(`${getBaseURL()}/log-error`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: error.message,
                    stack: error.stack,
                    context: 'Chat Communication',
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                })
            });

            thinkingPhase.style.display = 'none';
            // Remove API status element
            apiStatusElement.remove();
            appendMessage('Error', `Failed to communicate with the chatbot: ${error.message}`);
        });
});

// Regenerate button event listener
document.getElementById('regenerate-btn').addEventListener('click', () => {
    if (lastUserMessage) {
        // Simulate sending the last message again
        userInput.value = lastUserMessage;
        sendBtn.click();
    }
});

// Edit button event listener
document.getElementById('edit-btn').addEventListener('click', () => {
    if (lastUserMessage) {
        userInput.value = lastUserMessage;
        userInput.focus();
    }
});

// Check API status on page load and periodically
checkAPIStatus();
setInterval(checkAPIStatus, 150000);

// Initial welcome message
appendMessage('Chino', '*bows* Welcome to Rabbit House Café. *stares at you* oh its you again *smiles sweetly*');

document.querySelector('.chat-bot-circle').addEventListener('click', () => {
    const notificationEmoji = document.querySelector('.notification-emoji');
    if (notificationEmoji) {
        notificationEmoji.remove();
    }

    if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
        chatContainer.style.display = 'block';
    } else {
        chatContainer.style.display = 'none';
    }
});

// Close chat when clicking outside
document.addEventListener('click', (e) => {
    if (!chatContainer.contains(e.target) &&
        !document.querySelector('.chat-bot-circle').contains(e.target)) {
        chatContainer.style.display = 'none';
    }
});

function resetChat() {
    fetch(`${getBaseURL()}/reset-chat`, {
        method: 'POST'
    });
}