// Configuration file for Gemini AI and other settings
const CONFIG = {
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE', // Ganti dengan API key Gemini Anda
    FEATURES: {
        AI_CHAT: true,
        AI_BIO: true,
        AI_RECOMMENDATIONS: true,
        VISITOR_COUNTER: true,
        BACKGROUND_MUSIC: true,
        ANALYTICS: true
    },
    ANALYTICS: {
        TRACK_CLICKS: true,
        TRACK_VISITORS: true
    },
    MUSIC: {
        VOLUME: 0.5,
        AUTOPLAY: false
    }
};

// Visitor counter
let visitorCount = localStorage.getItem('visitorCount') || 0;
visitorCount = parseInt(visitorCount) + 1;
localStorage.setItem('visitorCount', visitorCount);