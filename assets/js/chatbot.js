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
    messageDiv.classList.add(sender === 'You' ? 'user-message' : 'chino-message');

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

sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    // Store last user message
    lastUserMessage = message;

    // Display the user's message
    appendMessage('You', message);
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
    const estimatedTime = Math.floor(Math.random() * (20 - 10 + 1)) + 15; // just freaking random, time to read the api documentation then :(
    estimatedTimeElement.textContent = `Estimated response time: ${estimatedTime} seconds`;

    // Array of audio file paths
    const audioFiles = [
        'assets/audio/Notifications/notification.mp3', // rare one
        ...Array.from({ length: 17 }, (_, i) => `assets/audio/Notifications/notif${i + 1}.wav`) // notif1.wav to notif17.wav
    ];

    // Function to select a random audio file with a higher chance for notification.mp3
    function getRandomAudioFile() {
        const randomNum = Math.random();
        // 20% chance to select notification.mp3, 80% chance to select one of the other sounds
        if (randomNum < 0.2) {
            return audioFiles[0]; // notification.mp3
        } else {
            const randomIndex = Math.floor(Math.random() * (audioFiles.length - 1)) + 1; // avoid the first element
            return audioFiles[randomIndex];
        }
    }

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
    .then((botResponse) => {
        const endTime = Date.now();
        const actualResponseTime = ((endTime - startTime) / 1000).toFixed(2);

        // Hide thinking phase
        thinkingPhase.style.display = 'none';
        // Remove API status element
        apiStatusElement.remove();

        // Store last bot response
        lastBotResponse = botResponse;

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

        // Display the bot's response
        appendMessage('Chino', botResponse);

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
        appendMessage('Error', `Failed to communicate with the chatbot: (I disabled the chatbot in these site, if you want to make the chatbot work, follow the repository steps -levs) ${error.message}`);
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