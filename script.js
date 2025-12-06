// Main JavaScript file with all interactive features
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Initialize all components
    initLoadingScreen();
    initParallaxEffect();
    initHoverAnimations();
    initAudioControls();
    initAIChat();
    initAnalytics();
    
    // Initialize AI features
    if (CONFIG.FEATURES.AI_BIO) {
        await generateAIBio();
    }
    
    if (CONFIG.FEATURES.AI_RECOMMENDATIONS) {
        await generateAIRecommendations();
    }
    
    if (CONFIG.FEATURES.VISITOR_COUNTER) {
        updateVisitorCounter();
    }
    
    // Initialize footer with current year
    updateFooter();
}

function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

// AI Chat Functions
function initAIChat() {
    if (!CONFIG.FEATURES.AI_CHAT) return;

    const chatWidget = document.querySelector('.ai-chat-widget');
    const toggleBtn = document.querySelector('.ai-toggle-btn');
    const closeBtn = document.querySelector('.ai-close-btn');
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');

    if (!chatWidget || !toggleBtn) {
        console.log('AI Chat elements not found');
        return;
    }

    // Toggle chat widget
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            setTimeout(() => aiInput?.focus(), 300);
        }
    });

    // Close chat widget
    closeBtn?.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatWidget.contains(e.target) && !toggleBtn.contains(e.target)) {
            chatWidget.classList.remove('active');
        }
    });

    // Send message function
    async function sendMessage() {
        if (!aiInput || !aiSendBtn) return;
        
        const message = aiInput.value.trim();
        if (!message) return;

        // Add user message
        addMessageToChat(message, 'user');
        aiInput.value = '';

        // Disable input while processing
        aiInput.disabled = true;
        aiSendBtn.disabled = true;

        // Show typing
        showTypingIndicator();

        try {
            const response = await geminiService.chatWithAI(message);
            
            setTimeout(() => {
                removeTypingIndicator();
                addMessageToChat(response, 'ai');
                
                // Re-enable input
                aiInput.disabled = false;
                aiSendBtn.disabled = false;
                aiInput.focus();
            }, 1000 + Math.random() * 500);
            
        } catch (error) {
            removeTypingIndicator();
            addMessageToChat('Maaf, sedang ada gangguan. Coba lagi nanti ya!', 'ai');
            aiInput.disabled = false;
            aiSendBtn.disabled = false;
        }
    }

    // Event listeners
    aiSendBtn?.addEventListener('click', sendMessage);
    aiInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add quick questions
    addQuickQuestions();
}

function addQuickQuestions() {
    if (!CONFIG.FEATURES.QUICK_QUESTIONS) return;
    
    const chatMessages = document.querySelector('.ai-chat-messages');
    if (!chatMessages) return;

    const quickQuestions = [
        "Rekomendasi musik dong",
        "Project apa yang sedang dikerjakan?",
        "Bisa collab nggak?",
        "Apa kabar?"
    ];

    const quickQuestionsDiv = document.createElement('div');
    quickQuestionsDiv.className = 'quick-questions';
    quickQuestionsDiv.innerHTML = `
        <p class="quick-questions-title">Coba tanya:</p>
        <div class="quick-questions-buttons">
            ${quickQuestions.map(q => 
                `<button class="quick-question-btn" data-question="${q}">${q}</button>`
            ).join('')}
        </div>
    `;
    
    chatMessages.appendChild(quickQuestionsDiv);

    // Quick question buttons
    document.querySelectorAll('.quick-question-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            const aiInput = document.getElementById('aiInput');
            if (aiInput) {
                aiInput.value = question;
                document.getElementById('aiSendBtn')?.click();
            }
        });
    });
}

function addMessageToChat(message, sender) {
    const chatMessages = document.querySelector('.ai-chat-messages');
    if (!chatMessages) return;

    // Remove quick questions for first user message
    if (sender === 'user') {
        const quickQuestions = chatMessages.querySelector('.quick-questions');
        if (quickQuestions) quickQuestions.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${timestamp}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.querySelector('.ai-chat-messages');
    if (!chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message ai-typing';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span class="typing-text">AI sedang mengetik...</span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.ai-typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Initialize AI Bio
async function generateAIBio() {
    if (!CONFIG.FEATURES.AI_BIO) return;
    
    const bioElement = document.getElementById('aiBioText');
    if (!bioElement) return;

    try {
        const bio = await geminiService.generatePersonalizedBio();
        bioElement.textContent = bio;
    } catch (error) {
        bioElement.textContent = "Tech enthusiast & music lover 🎵 | Building digital experiences 💻";
    }
}

// Initialize AI Recommendations
async function generateAIRecommendations() {
    if (!CONFIG.FEATURES.AI_RECOMMENDATIONS) return;
    
    const container = document.getElementById('aiRecommendedLinks');
    if (!container) return;

    try {
        const recommendations = await geminiService.generateLinkRecommendations();
        container.innerHTML = recommendations.map(rec => `
            <a href="${rec.url}" class="link-item" target="_blank" rel="noopener">
                <i class="${rec.icon}"></i>
                <span>${rec.name}</span>
                <span class="link-badge">${rec.badge}</span>
            </a>
        `).join('');
    } catch (error) {
        console.log('AI recommendations failed');
    }
}

// Update visitor counter
function updateVisitorCounter() {
    if (!CONFIG.FEATURES.VISITOR_COUNTER) return;
    
    const element = document.getElementById('visitorCount');
    if (element) {
        element.textContent = visitorCount.toLocaleString();
    }
}

// Panggil fungsi inisialisasi di DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initAIChat();
    generateAIBio();
    generateAIRecommendations();
    updateVisitorCounter();
});

}

function initParallaxEffect() {
    document.addEventListener('mousemove', function(e) {
        const parallaxBg = document.querySelector('.parallax-bg');
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        parallaxBg.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.1)`;
    });
}

function initHoverAnimations() {
    // Link items animation
    const linkItems = document.querySelectorAll('.link-item');
    linkItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Profile image animation
    const profileImg = document.querySelector('.profile-img');
    profileImg.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(5deg)';
    });
    
    profileImg.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0)';
    });
}

function initAudioControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const musicPlayer = document.querySelector('.music-player');

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            audioService.togglePlay();
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            audioService.toggleMute();
        });
    }

    // Add click to play on music player
    if (musicPlayer) {
        musicPlayer.addEventListener('click', (e) => {
            if (!e.target.closest('.music-controls')) {
                audioService.togglePlay();
            }
        });
    }
}

function initAIChat() {
    const chatWidget = document.querySelector('.ai-chat-widget');
    const toggleBtn = document.querySelector('.ai-toggle-btn');
    const closeBtn = document.querySelector('.ai-close-btn');
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const refreshBioBtn = document.querySelector('.refresh-bio-btn');

    let conversationHistory = [];

    // Toggle chat widget
    toggleBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('active');
    });

    // Close chat widget
    closeBtn.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Send message
    async function sendMessage() {
        const message = aiInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat(message, 'user');
        aiInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Get AI response
        try {
            const response = await geminiService.chatWithAI(message, conversationHistory);
            conversationHistory.push(`User: ${message}`, `AI: ${response}`);
            
            // Remove typing indicator and add AI response
            removeTypingIndicator();
            addMessageToChat(response, 'ai');
        } catch (error) {
            removeTypingIndicator();
            addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
        }
    }

    // Send message on button click or Enter key
    aiSendBtn.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Refresh bio
    if (refreshBioBtn) {
        refreshBioBtn.addEventListener('click', generateAIBio);
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.querySelector('.ai-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.querySelector('.ai-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message ai-typing';
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.ai-typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function generateAIBio() {
    const bioElement = document.getElementById('aiBioText');
    if (!bioElement) return;

    bioElement.textContent = 'Generating personalized bio...';
    
    const profileInfo = {
        name: 'Arfi Putra Ramadhan',
        interests: ['music', 'technology', 'social media', 'programming', 'Spotify', 'TikTok']
    };

    try {
        const bio = await geminiService.generatePersonalizedBio(profileInfo.name, profileInfo.interests);
        bioElement.textContent = bio;
    } catch (error) {
        bioElement.textContent = "Tech enthusiast & music lover 🎵 | Building digital experiences 💻";
    }
}

async function generateAIRecommendations() {
    const recommendationsContainer = document.getElementById('aiRecommendedLinks');
    if (!recommendationsContainer) return;

    const profileInfo = {
        name: 'Arfi Putra Ramadhan',
        interests: ['music production', 'web development', 'social media', 'programming', 'digital marketing']
    };

    try {
        const recommendations = await geminiService.generateLinkRecommendations(profileInfo);
        
        if (Array.isArray(recommendations)) {
            recommendationsContainer.innerHTML = recommendations.map(rec => `
                <a href="${rec.url}" class="link-item" target="_blank" data-analytics="ai-recommended-${rec.name.toLowerCase()}">
                    <i class="${rec.icon}"></i>
                    <span>${rec.name}</span>
                    <span class="link-badge">${rec.badge}</span>
                </a>
            `).join('');
        }
    } catch (error) {
        console.error('Error generating AI recommendations:', error);
    }
}

function updateVisitorCounter() {
    const visitorCountElement = document.getElementById('visitorCount');
    if (visitorCountElement) {
        visitorCountElement.textContent = visitorCount.toLocaleString();
    }
}

function updateFooter() {
    const footerElement = document.getElementById('dynamicFooter');
    if (footerElement) {
        const currentYear = new Date().getFullYear();
        footerElement.textContent = `Arfi Putra Ramadhan © ${currentYear}`;
    }
}

function initAnalytics() {
    if (!CONFIG.ANALYTICS.TRACK_CLICKS) return;

    // Track link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-analytics]');
        if (link) {
            const analyticsLabel = link.getAttribute('data-analytics');
            console.log(`Link clicked: ${analyticsLabel} - ${link.href}`);
            // Here you can send this data to Google Analytics or any analytics service
        }
    });

    // Track page views
    console.log('Page viewed:', {
        timestamp: new Date().toISOString(),
        visitorCount: visitorCount
    });
}

// Background music dengan interaksi pengguna
function startBackgroundMusic() {
    const audio = document.getElementById("backgroundMusic");
    let musicStarted = false;

    function startMusic() {
        if (!musicStarted) {
            audio.volume = CONFIG.MUSIC.VOLUME;
            audio.play().catch(e => console.log("Autoplay prevented:", e));
            musicStarted = true;
            document.removeEventListener("click", startMusic);
            document.removeEventListener("touchstart", startMusic);
        }
    }

    document.addEventListener("click", startMusic);
    document.addEventListener("touchstart", startMusic);
}

// Initialize background music
startBackgroundMusic();