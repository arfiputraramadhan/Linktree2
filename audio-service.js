// Audio Service for background music management
class AudioService {
    constructor() {
        this.audio = document.getElementById('backgroundMusic');
        this.isPlaying = false;
        this.isMuted = false;
        this.init();
    }

    init() {
        this.audio.volume = CONFIG.MUSIC.VOLUME;
        
        // Add event listeners for audio events
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play().catch(e => {
            console.log('Audio play failed:', e);
            // Require user interaction
            this.showPlayInstruction();
        });
    }

    pause() {
        this.audio.pause();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        this.updateMuteButton();
    }

    updatePlayButton() {
        const playBtn = document.getElementById('playPauseBtn');
        if (playBtn) {
            const icon = playBtn.querySelector('i');
            icon.className = this.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        }
    }

    updateMuteButton() {
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            const icon = muteBtn.querySelector('i');
            icon.className = this.isMuted ? 'fa-solid fa-volume-mute' : 'fa-solid fa-volume-high';
        }
    }

    showPlayInstruction() {
        // Show a subtle notification that user needs to interact
        const musicInfo = document.querySelector('.music-info');
        if (musicInfo) {
            const originalText = musicInfo.querySelector('span').textContent;
            musicInfo.querySelector('span').textContent = 'Click to play music';
            
            setTimeout(() => {
                musicInfo.querySelector('span').textContent = originalText;
            }, 2000);
        }
    }

    setVolume(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
    }
}

// Initialize Audio Service
const audioService = new AudioService();