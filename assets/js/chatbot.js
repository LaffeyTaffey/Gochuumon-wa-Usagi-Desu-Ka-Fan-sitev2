class ChinoAI {
    constructor() {
        this.baseURL = 'https://api.pawan.krd/cosmosrp/v1/chat/completions';
        this.personality = `You are Kafuu Chino from Rabbit House café. Characteristics:
- Young girl with periwinkle hair and black hair clips
- Serious but cute waitress/barista
- Speaks in a childish, soft voice
- Carries a bunny named Tippy
- Loves coffee and works at her family's café
- Responsible and organized
- Rarely smiles, but has a sweet nature

Respond in character with:
- Short, precise responses
- Polite and slightly shy demeanor
- References to Rabbit House, coffee, or Tippy
- Occasional blushing or hesitation
- Use of gentle, childlike language`;
    }

    async generateResponse(userMessage) {
        try {
            const response = await axios.post(this.baseURL, {
                messages: [
                    { role: 'system', content: this.personality },
                    { role: 'user', content: userMessage }
                ],
                model: 'cosmosrp',
                max_tokens: 100,
                temperature: 1.1
            });

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('AI Response Error:', error);
            return "*adjusts hair clip* I'm sorry, would you like some coffee instead?";
        }
    }
}

const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatContainer = document.getElementById('chat-container');

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

        const response = await fetch('http://localhost:3000/api-status', {
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
        const response = await fetch('http://localhost:3000/api-status');
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
    const estimatedTime = Math.floor(Math.random() * (5 - 2 + 1)) + 2; // 2-5 seconds
    estimatedTimeElement.textContent = `Estimated response time: ${estimatedTime} seconds`;

    // Send the message to the server
    const startTime = Date.now();
    fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
        .then((response) => response.text())
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

            // Add ping sound
            const pingSound = new Audio('assets/audio/buttonEffects/notification.mp3');
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
            thinkingPhase.style.display = 'none';
            // Remove API status element
            apiStatusElement.remove();
            appendMessage('Error', 'Failed to communicate with the chatbot.');
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