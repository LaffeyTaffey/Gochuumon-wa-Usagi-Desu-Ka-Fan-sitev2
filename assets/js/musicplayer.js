class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = 0;
        this.visualizer = null;
        this.audioContext = null;
        this.analyser = null;
        this.isRepeat = false;
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
        
        this.playlist = [
            { title: "Song 1", artist: "Kafuu Chino", file: "assets/audio/Music/03.mp3" },
            { title: "Song 2", artist: "Syaro Kirima", file: "assets/audio/Music/04.mp3" },
            { title: "Song 3", artist: "Goku", file: "assets/audio/Music/05.mp3" },
            { title: "Song 4", artist: "Elaina", file: "assets/audio/Music/06.mp3" },
            { title: "Song 5", artist: "Kanade", file: "assets/audio/Music/07.mp3" },
            { title: "Song 6", artist: "Tachibana", file: "assets/audio/Music/08.mp3" },
            { title: "Song 7", artist: "Megumi", file: "assets/audio/Music/09.mp3" },
            { title: "Song 8", artist: "AYA", file: "assets/audio/Music/10.mp3" },
            { title: "Song 9", artist: "Stellaris", file: "assets/audio/Music/11.mp3" },
            { title: "Song 10", artist: "Hu Tao", file: "assets/audio/Music/12.mp3" },
            { title: "Song 11", artist: "Kokona", file: "assets/audio/Music/13.mp3" },
            { title: "Song 12", artist: "Cococa", file: "assets/audio/Music/14.mp3" },
            { title: "Song 13", artist: "Mocha", file: "assets/audio/Music/15.mp3" },
            { title: "Song 14", artist: "Espresso", file: "assets/audio/Music/16.mp3" },
            { title: "Song 15", artist: "Tumbangpreso", file: "assets/audio/Music/17.mp3" },
            { title: "Song 16", artist: "Namputa", file: "assets/audio/Music/18.mp3" },
            { title: "Song 17", artist: "Leche", file: "assets/audio/Music/19.mp3" },
            { title: "Song 18", artist: "Flan", file: "assets/audio/Music/20.mp3" },
            { title: "Song 19", artist: "Emilia", file: "assets/audio/Music/21.mp3" },
            { title: "Song 20", artist: "Osu", file: "assets/audio/Music/22.mp3" },
        ];

        
        this.initElements();
        this.initPlaylist();
        this.initEventListeners();
        this.initMiniPlayer();
        this.loadTrack(this.currentTrack);
}

    initElements() {
        this.playerPanel = document.querySelector('.music-player-panel');
        this.playBtn = document.querySelector('.control-btn.play');
        this.prevBtn = document.querySelector('.control-btn.prev');
        this.nextBtn = document.querySelector('.control-btn.next');
        this.shuffleBtn = document.querySelector('.control-btn.shuffle');
        this.repeatBtn = document.querySelector('.control-btn.repeat');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.currentTimeEl = document.querySelector('.current-time');
        this.totalTimeEl = document.querySelector('.total-time');
        this.volumeSlider = document.querySelector('.volume-slider');
        this.musicToggle = document.querySelector('.music-button');
        this.trackTitleEl = document.querySelector('.track-title');
        this.trackArtistEl = document.querySelector('.track-artist');
    }

    initEventListeners() {
        this.musicToggle.addEventListener('click', () => {
            this.togglePanel();
            if (!this.audioContext) {
                this.initVisualizer();
            }
        });

        this.repeatBtn.addEventListener('click', () => {
        this.toggleRepeat();
        if (this.isRepeat) {
            this.restartTrack();
        }
    });

        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));
        this.shuffleBtn.addEventListener('click', () => this.shufflePlaylist());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
    }

    shufflePlaylist() {
    for (let i = this.playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
    }
    this.currentTrack = 0;
    this.loadTrack(this.currentTrack);
    this.initPlaylist();
}

toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.repeatBtn.classList.toggle('active');
    if (this.isRepeat) {
        this.audio.loop = true;
    } else {
        this.audio.loop = false;
    }
}

restartTrack() {
    this.audio.currentTime = 0;
    this.audio.play();
    this.isPlaying = true;
    this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

handleTrackEnd() {
    if (this.isRepeat) {
        this.restartTrack();
    } else {
        this.nextTrack();
    }
}

    initVisualizer() {
        const canvas = document.getElementById('audioVisualizer');
        if (!canvas) {
            console.error('Audio visualizer canvas not found');
            return;
        }
        const ctx = canvas.getContext('2d');
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        
        const source = this.audioContext.createMediaElementSource(this.audio);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        const animate = () => {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 183, 197, 0.5)';
            
            const barWidth = canvas.width / bufferLength * 2.5;
            let x = 0;
            
            for(let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    initPlaylist() {
        const trackList = document.querySelector('.track-list');
        if (trackList) {
            trackList.innerHTML = ''; // Clear existing list items
            this.playlist.forEach((track, index) => {
                const li = document.createElement('li');
                li.textContent = `${track.title} - ${track.artist}`;
                li.addEventListener('click', () => {
                    this.loadTrack(index);
                    this.togglePlay();
                });
                trackList.appendChild(li);
            });
        } else {
            console.error('Track list element not found');
        }
    }

    initMiniPlayer() {
        this.miniPlayer = document.querySelector('.mini-player');
        this.miniTrackTitle = document.querySelector('.mini-track-title');
    }

    loadTrack(trackIndex) {
        if (trackIndex >= 0 && trackIndex < this.playlist.length) {
            this.currentTrack = trackIndex;
            const track = this.playlist[this.currentTrack];
            this.audio.src = track.file;
            this.trackTitleEl.textContent = track.title;
            this.trackArtistEl.textContent = track.artist;
            this.audio.load();
            
            // Update mini player
            this.miniTrackTitle.textContent = `${track.title} - ${track.artist}`;
            this.miniPlayer.classList.add('active');
            
            // Update playlist highlighting
            const trackList = document.querySelector('.track-list');
            if (trackList) {
                trackList.querySelectorAll('li').forEach((li, index) => {
                    li.classList.toggle('active', index === trackIndex);
                });
            }
        }
    }
togglePanel() {
    console.log('Toggle panel called'); 
    console.log('Player panel:', this.playerPanel);
    console.log('Music toggle:', this.musicToggle);

    if (this.playerPanel) {
        this.playerPanel.classList.toggle('active');
        
        // Ensure the music toggle icon exists before manipulating
        const musicToggleIcon = this.musicToggle.querySelector('i');
        if (musicToggleIcon) {
            musicToggleIcon.classList.toggle('music-playing');
        }

        showNotification('Music player ' + (this.playerPanel.classList.contains('active') ? 'opened' : 'closed'));
        
        if (!this.playerPanel.classList.contains('active')) {
            if (this.miniPlayer) {
                this.miniPlayer.classList.add('active');
            }
        }
    } else {
        console.error('Player panel not found!');
    }
}

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.audio.play();
            this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        this.isPlaying = !this.isPlaying;
    }

    prevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        this.audio.play();
this.isPlaying = true;
this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        this.audio.play();
this.isPlaying = true;
this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    updateProgress() {
        const { duration, currentTime } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progress.style.width = `${progressPercent}%`;
        this.currentTimeEl.textContent = this.formatTime(currentTime);
        this.totalTimeEl.textContent = this.formatTime(duration);
    }

    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    setVolume(e) {
        this.audio.volume = e.target.value;
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// Initialize the music player
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});