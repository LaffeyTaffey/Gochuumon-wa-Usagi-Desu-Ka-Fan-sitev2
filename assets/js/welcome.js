$(document).ready(function () {
    const welcomeScreen = $('#welcome-screen');
    const japaneseSubtitle = $('.japanese-subtitle');
    const englishSubtitle = $('.english-subtitle');
    const startButton = $('#start-button');
    const unmuteButton = $('#unmute-button');
    const subtitleContainer = $('.subtitle-container');
    const audio = new Audio('assets/audio/Voicebank/01-1.mp3');
    const video = document.getElementById('background-video');

    const phrases = [
        { text: "いらっしゃいませあなたが新人さんです", subtitle: "Welcome... you must be the newcomer.", start: 0, end: 4.4 },
        { text: "ね私は知乃です分から", subtitle: "I'm Chino.", start: 4.4, end: 6.3 },
        { text: "ないことがあれば何で", subtitle: "If you have any questions,", start: 6.3, end: 7.9, fadeOutStart: true },
        { text: "も聞いてください", subtitle: "please feel free to ask me.", start: 7.9, end: 8.8 }
    ];

    let isVideoUnmuted = false;
    let isStartButtonPressed = false;

    // Check if the welcome message has already been shown
    if (!sessionStorage.getItem('welcomeShown')) {
        welcomeScreen.addClass('show');
        sessionStorage.setItem('welcomeShown', 'true');
    }

    function updateSubtitles(time) {
        const currentPhrase = phrases.find(phrase => time >= phrase.start && time < phrase.end);
        if (currentPhrase) {
            japaneseSubtitle.text(currentPhrase.text);
            englishSubtitle.text(currentPhrase.subtitle);
            subtitleContainer.addClass('show');

            // Gradual fade out when fadeOutStart is true
            if (currentPhrase.fadeOutStart && isVideoUnmuted && isStartButtonPressed) {
                const volumeStages = [
                    { threshold: 0, volume: 0.05 },   // Initial volume when start button is pressed
                    { threshold: 6.4, volume: 0.03 }, // First stage reduction
                    { threshold: 6.5, volume: 0.01 }, // Second stage reduction
                    { threshold: 6.6, volume: 0.005 } // Final stage reduction
                ];

                // Find the appropriate volume stage
                const currentStage = volumeStages.findLast(stage => time >= stage.threshold);
                
                if (currentStage) {
                    video.volume = currentStage.volume;
                }
            }
        } else {
            japaneseSubtitle.text('');
            englishSubtitle.text('');
            subtitleContainer.removeClass('show');
        }
    }

    startButton.on('click', function() {
        $(this).prop('disabled', true).css('opacity', '0.5');
        subtitleContainer.fadeIn();
        
        // Set flag that start button is pressed
        isStartButtonPressed = true;

        // If video was unmuted, set volume to 5%
        if (isVideoUnmuted) {
            video.volume = 0.05;
        }
        
        audio.play();
    });

    unmuteButton.on('click', function () {
        // Toggle video mute state
        if (video.muted) {
            // If currently muted, unmute and fade in
            video.muted = false;
            isVideoUnmuted = true;

            // Start with 0 volume and fade in
            video.volume = 0;
            let currentVolume = 0;

            const fadeInInterval = setInterval(() => {
                currentVolume += 0.1;
                if (currentVolume <= 0.5) {
                    video.volume = currentVolume;
                } else {
                    video.volume = 0.5;
                    clearInterval(fadeInInterval);
                }
            }, 100);

            // Visual indication of unmuted state
            $(this).addClass('unmuted');
        } else {
            // If currently unmuted, mute
            video.muted = true;
            isVideoUnmuted = false;
            video.volume = 0;

            // Visual indication of muted state
            $(this).removeClass('unmuted');
        }
    });

    audio.addEventListener('timeupdate', function () {
        updateSubtitles(audio.currentTime);
    });

    audio.addEventListener('ended', function() {
    // Add the fade-out class to trigger the CSS transition
    welcomeScreen.addClass('fade-out');

    // Use transitionend event to ensure fade-out completes
    welcomeScreen.one('transitionend', function() {
        welcomeScreen.remove();
        
        // Play a random track
        const player = window.musicPlayer;
        if (player) {
            const randomTrackIndex = Math.floor(Math.random() * player.playlist.length);
            player.loadTrack(randomTrackIndex);
            player.togglePlay();
        }
    });
});
});
