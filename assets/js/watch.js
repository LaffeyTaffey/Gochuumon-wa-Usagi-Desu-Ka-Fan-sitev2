function initializeVideoPlayer() {
    let fps = 30; // Assuming 30 fps
    let currentFrame = 0;
    let totalFrames = 0;

    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.muted = true;  // Ensure the video is not muted by default
    const videoCanvas = document.getElementById('videoCanvas');
    const ctx = videoCanvas.getContext('2d');
    const episodeSelector = document.getElementById('episodeSelector');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevFrameBtn = document.getElementById('prevFrameBtn');
    const nextFrameBtn = document.getElementById('nextFrameBtn');
    const randomFrameBtn = document.getElementById('randomFrameBtn');
    const downloadFrameBtn = document.getElementById('downloadFrameBtn');
    const downloadVideoBtn = document.getElementById('downloadVideoBtn');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const videoTitleDiv = document.getElementById('videoTitle');

    let currentSeason = '1';
    let currentEpisodeIndex = 0;

    // Modal functionality
    const modal = document .getElementById('frameModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');

    function populateEpisodeSelector() {
        episodeSelector.innerHTML = '';
        videoData[currentSeason].episodes.forEach((episode, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = episode.title;
            episodeSelector.appendChild(option);
        });
    }

    playPauseBtn.addEventListener('click', () => {
    if (videoPlayer.paused) {
        videoPlayer.muted = false; // Unmute when playing
        videoPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        updateCanvas();
    } else {
        videoPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

    // Add video ended event
    videoPlayer.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // Add hover tooltips to buttons
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(button => {
        button.setAttribute('title', button.querySelector('i').className.split('-')[1]);
    });

    function loadVideo(index) {
    currentEpisodeIndex = index;
    const episode = videoData[currentSeason].episodes[index];
    videoPlayer.src = episode.src;
    videoTitleDiv.textContent = episode.title;

    // Update episode details
    document.getElementById('episodeTitle').textContent = episode.title;
    document.getElementById('episodeDescription').textContent = episode.description;

    // Update anime details
    document.getElementById('animeTitle').textContent = videoData[currentSeason].title;
    document.getElementById('animeDescription').textContent = videoData[currentSeason].description;
    document.getElementById('animeSeason').textContent = `Season: ${currentSeason}`;
    document.getElementById('animeEpisodeCount').textContent = `Total Episodes: ${videoData[currentSeason].episodeCount}`;

    videoPlayer.load();

    // Show initial frame when video is loaded
    videoPlayer.addEventListener('loadeddata', () => {
        ctx.drawImage(videoPlayer, 0, 0, videoCanvas.width, videoCanvas.height);
        totalFrames = Math.floor(videoPlayer.duration * fps);
        document.getElementById('totalFrames').textContent = totalFrames;
    });
}

    function updateCanvas() {
        if (videoPlayer.paused || videoPlayer.ended) return;
        ctx.drawImage(videoPlayer, 0, 0, videoCanvas.width, videoCanvas.height);
        requestAnimationFrame(updateCanvas);
    }

    function updateVideoPlayer(seasonId) {
        if (seasonId === 'anime') {
            // Default to season 1 if just "anime" is selected
            currentSeason = '1';
        } else if (seasonId === 'manga') {
            console.log('Manga selected');
            return;
        }
        populateEpisodeSelector();
        loadVideo(0);
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    episodeSelector.addEventListener('change', (e) => loadVideo(parseInt(e.target.value)));

    prevFrameBtn.addEventListener('click', () => {
        videoPlayer.currentTime = Math.max(videoPlayer.currentTime - 1/30, 0);
        ctx.drawImage(videoPlayer, 0, 0, videoCanvas.width, videoCanvas.height);
    });

    nextFrameBtn.addEventListener('click', () => {
        videoPlayer.currentTime = Math.min(videoPlayer.currentTime + 1/30, videoPlayer.duration);
        ctx.drawImage(videoPlayer, 0, 0, videoCanvas.width, videoCanvas.height);
    });

    randomFrameBtn.addEventListener('click', () => {
        videoPlayer.currentTime = Math.random() * videoPlayer.duration;
        ctx.drawImage(videoPlayer, 0, 0, videoCanvas.width, videoCanvas.height);
    });

    downloadFrameBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `frame-${Date.now()}.png`;
        link.href = videoCanvas.toDataURL();
        link.click();
    });

    downloadVideoBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = videoTitleDiv.textContent + '.mp4';
        link.href = videoPlayer.src;
        link.click();
    });

    videoPlayer.addEventListener('loadedmetadata', () => {
        videoCanvas.width = videoPlayer.videoWidth;
        videoCanvas.height = videoPlayer.videoHeight;
        durationSpan.textContent = formatTime(videoPlayer.duration);
    });

    // Update frame counter during playback
    videoPlayer.addEventListener('timeupdate', () => {
        currentFrame = Math.floor(videoPlayer.currentTime * fps);
        document.getElementById('currentFrame').textContent = currentFrame;
        currentTimeSpan.textContent = formatTime(videoPlayer.currentTime);
    });

    // Back to Entries button
    document.getElementById('backToEntries').addEventListener('click', () => {
        document.getElementById('entries').scrollIntoView({ behavior: 'smooth' });
    });

    // Initialize
    populateEpisodeSelector();
    loadVideo(0);

    // Link entry cards to watch section
    document.querySelectorAll('.entry-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        // Map the index to the correct season/entry ID
        switch(index) {
            case 0: // Season 1
                currentSeason = '1';
                break;
            case 1: // Season 2
                currentSeason = '2';
                break;
            case 2: // Dear My Sister
                currentSeason = 'movie';
                break;
            case 3: // Sing For You
                currentSeason = 'ova';
                break;
            case 4: // BLOOM
                currentSeason = '3';
                break;
            default:
                currentSeason = '1';
        }

        populateEpisodeSelector();
        loadVideo(0); // Load the first episode of the selected season
        document.getElementById('watch').scrollIntoView({ behavior: 'smooth' });
    });
});

    // Modal for clicking on canvas
videoCanvas.addEventListener('click', () => {
    modal.style.display = 'block';
    modalImg.src = videoCanvas.toDataURL();
    modal.classList.add('show');
    
    // Ensure the video is playing and unmuted
    videoPlayer.muted = false; // Unmute the video
    videoPlayer.play(); // Play the video
});

// Close modal functionality
closeModal.addEventListener('click', closeModalWithAnimation);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModalWithAnimation();
    }
});

    function closeModalWithAnimation() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match transition duration
    }

    closeModal.addEventListener('click', closeModalWithAnimation);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModalWithAnimation();
        }
    });

// Modal controls
document.getElementById('modalPrevFrame').addEventListener('click', () => {
    currentFrame = Math.max(currentFrame - 1, 0);
    videoPlayer.currentTime = currentFrame / fps;
    ctx.drawImage(videoPlayer, 0, 0, videoCanvas.width, videoCanvas.height);
    modalImg.src = videoCanvas.toDataURL();
});

document.getElementById('modalPlayVideo').addEventListener('click', () => {
    videoPlayer.play();
});

document.getElementById('modalNextFrame').addEventListener('click', () => {
    currentFrame = Math.min(currentFrame + 1, totalFrames - 1);
    videoPlayer.currentTime = currentFrame / fps;
    ctx.drawImage(videoPlayer, 0, 0, videoCanvas.width, videoCanvas.height);
    modalImg.src = videoCanvas.toDataURL();
});

document.getElementById('modalDownloadFrame').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `frame-${Date.now()}.png`;
    link.href = videoCanvas.toDataURL();
    link.click();
});

document.getElementById('modalClose').addEventListener('click', closeModalWithAnimation);


// Fullscreen button
const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        videoCanvas.requestFullscreen();
        videoPlayer.muted = false; // Unmute the video when entering fullscreen
        videoPlayer.play(); // Ensure the video plays
    }
});
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof videoData !== 'undefined') {
        initializeVideoPlayer();
    } else {
        console.error('videoData is not loaded. Make sure videoData.js is included before watch.js');
    }
});