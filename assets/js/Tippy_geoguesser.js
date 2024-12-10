// Character-specific game modifiers
const CHARACTER_ABILITIES = {
    cocoa: {
        name: "Cocoa",
        ability: "Extra Hint",
        description: "Provides a helpful location hint at the start of each round",
        modify: function (gameInstance) {
            try {
                const hints = {
                    "France": "Hint: Looks like a charming European cafe street!",
                    "Hungary": "Hint: Urban setting with interesting architecture",
                    "default": "Scenic location with unique characteristics"
                };

                if (gameInstance.currentLocation && gameInstance.currentLocation.region) {
                    gameInstance.locationHint = hints[gameInstance.currentLocation.region] || hints.default;
                    gameInstance.showCharacterHint();
                }
            } catch (error) {
                console.error("Error in Cocoa's ability:", error);
            }
        }
    },
    chino: {
        name: "Chino",
        ability: "Precision Bonus",
        description: "Increases points earned for more accurate guesses",
        modify: function (gameInstance) {
            gameInstance.scoringMultiplier = 1.2;
        }
    },
    rize: {
        name: "Rize",
        ability: "Distance Reduction",
        description: "Reduces the penalty for distance in scoring",
        modify: function (gameInstance) {
            gameInstance.distanceReductionFactor = 0.8;
        }
    }
};

// Expanded location database
const locations = [
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731698971550!6m8!1m7!1sUDeb8ZgQeR1hacX8QxoDHg!2m2!1d48.07602120420642!2d7.358850250442073!3f295.1430699413258!4f13.314338862111114!5f0.7820865974627469",
        lat: 48.076021,
        lng: 7.358850,
        region: "France",
        difficulty: "easy"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731700428861!6m8!1m7!1sfbOzXLxcIR8gcsP-14IM1w!2m2!1d48.07619477343237!2d7.35846757621527!3f163.41206206766722!4f-1.3994257764788927!5f0.7820865974627469",
        lat: 48.076194,
        lng: 7.358467,
        region: "France",
        difficulty: "easy"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731735285132!6m8!1m7!1sFC9NT87hsVag1HRiaZK6LQ!2m2!1d48.07799489900381!2d7.355680515658755!3f103.56209437237635!4f4.312777402236364!5f0.8079472716015412",
        lat: 48.077994,
        lng: 7.355680,
        region: "France",
        difficulty: "medium"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731738499384!6m8!1m7!1sdZ054jnV5bRF6h1olocciA!2m2!1d48.0771804755481!2d7.361328836659704!3f193.0156631219519!4f2.83568044013397!5f0.7820865974627469",
        lat: 48.077180,
        lng: 7.361328,
        region: "France",
        difficulty: "medium"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731740164402!6m8!1m7!1sXEcR8kJ9i3b3MTQij1rncA!2m2!1d48.07622120464004!2d7.354327879241388!3f157.61820031035427!4f7.192318423564345!5f0.7820865974627469",
        lat: 48.076221,
        lng: 7.354327,
        region: "France",
        difficulty: "hard"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731741560440!6m8!1m7!1sSI-7DgM9sr4mXErNuPNwAw!2m2!1d48.1670511718898!2d7.297102164420915!3f118.69024210115568!4f8.798592839291388!5f0.7820865974627469",
        lat: 48.167051,
        lng: 7.297102,
        region: "France",
        difficulty: "hard"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731742265922!6m8!1m7!1s72wbFq71DXJzPCmaT6z_qQ!2m2!1d48.07646068854198!2d7.36098806603548!3f139.58762739288477!4f13.288346101785208!5f0.7820865974627469",
        lat: 48.076460,
        lng: 7.360988,
        region: "France",
        difficulty: "easy"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731742838523!6m8!1m7!1sGrN2ef4zEBlUyDRMe1_L7g!2m2!1d48.07433853254033!2d7.359683479719591!3f209.23697988393485!4f2.6705976233596544!5f0.7820865974627469",
        lat: 48.074338,
        lng: 7.359683,
        region: "France",
        difficulty: "medium"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731743963873!6m8!1m7!1sLbd9nP7s62PgNQdA6ZVLgw!2m2!1d48.07411933112647!2d7.359399730427215!3f76.32295084421894!4f12.578158090074382!5f0.7820865974627469",
        lat: 48.074119,
        lng: 7.359399,
        region: "France",
        difficulty: "hard"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731744507763!6m8!1m7!1sHL1wwr6zwZ6ApRbeQI2w2g!2m2!1d48.58003570376869!2d7.743074431308988!3f353.50636953902796!4f7.487678780911807!5f1.5164582667551612",
        lat: 48.580035,
        lng: 7.743074,
        region: "France",
        difficulty: "medium"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731744926367!6m8!1m7!1srHudfAYFPpa11bLNJDT43g!2m2!1d48.07451215847319!2d7.360351092293983!3f240.19927395607385!4f3.7734861630895864!5f2.891393991268303",
        lat: 48.074512,
        lng: 7.360351,
        region: "France",
        difficulty: "hard"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731746722929!6m8!1m7!1s-iFOl1VmKROqNpqNVXncBg!2m2!1d48.07562607691835!2d7.359222798450768!3f173.9431507137133!4f2.6001888615042503!5f0.7820865974627469",
        lat: 48.075626,
        lng: 7.359222,
        region: "France",
        difficulty: "easy"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731747212371!6m8!1m7!1sMmd334dIgtmYQEak79CDzw!2m2!1d48.07407211090847!2d7.359247475142269!3f237.9099148075341!4f12.770247209484197!5f0.7820865974627469",
        lat: 48.074072,
        lng: 7.359247,
        region: "France",
        difficulty: "medium"
    },
    // Hungarian locations
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731748508 162!6m8!1m7!1sCAoSLEFGMVFpcE04OVVoVTUwUTZha0JDM3R3eHo3aUNSakJvV3p0MHhqc0JKU1NM!2m2!1d47.5185562271493!2d19.08139396490302!3f124.01241240696766!4f21.982143397670114!5f1.9531374918225648",
        lat: 47.518556,
        lng: 19.081394,
        region: "Hungary",
        difficulty: "easy"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731748730419!6m8!1m7!1sCAoSLEFGMVFpcE1NaHBYNjl1ZndvSXhublBYbmxNVWFGTDZKTTl6RU5ENV9qX1NH!2m2!1d47.5183655718422!2d19.0814409616318!3f88.29863566507048!4f18.170645441814315!5f1.5366184664772655",
        lat: 47.518366,
        lng: 19.081441,
        region: "Hungary",
        difficulty: "medium"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731748942144!6m8!1m7!1sCAoSLEFGMVFpcE1IUk9IMW5LdklSV0VyLWJEUTF3emIyWDJPclM5enBmSGd1a2hu!2m2!1d47.51834183615217!2d19.08187753334101!3f71.8812097916842!4f12.539097885087017!5f0.7820865974627469",
        lat: 47.518342,
        lng: 19.081878,
        region: "Hungary",
        difficulty: "hard"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731749640942!6m8!1m7!1sCAoSLEFGMVFpcE9UNGpCSmNPTkZPNTB6X3hseDhBSXBtWWk1bWVhNjdKcktoYjc1!2m2!1d47.48374319683808!2d19.05188187194119!3f170.4189223388175!4f18.183031377609268!5f0.7820865974627469",
        lat: 47.483743,
        lng: 19.051882,
        region: "Hungary",
        difficulty: "medium"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731751413359!6m8!1m7!1sCAoSLEFGMVFpcE5ReWY3cEg1dE5ZYkE5RmE2WDZ4VlZMdGZmN0VMLUlFZGlUODF1!2m2!1d47.48371600710892!2d19.05200971090607!3f76.09045382185087!4f6.66997957935466!5f0.4000000000000002",
        lat: 47.483716,
        lng: 19.052010,
        region: "Hungary",
        difficulty: "hard"
    },
    {
        iframe: "https://www.google.com/maps/embed?pb=!4v1731751728817!6m8!1m7!1sCAoSLEFGMVFpcE1fQXpaek9GN2s3QUJDeGZnN0lYbHhPb1Z3SjctVERQWHJNSHNO!2m2!1d47.48373824839541!2d19.05182268358018!3f85.64195431768573!4f-6.833435269114716!5f0.7820865974627469",
        lat: 47.483738,
        lng: 19.051823,
        region: "Hungary",
        difficulty: "hard"
    }
];

class GochiusaGeoGuesser {
    constructor() {
        this.currentLocation = null;
        this.score = 0;
        this.round = 1;
        this.maxRounds = 5;
        this.difficulty = "easy";
        this.selectedCharacter = "cocoa";
        this.roundResults = [];
        this.timer = null;
        this.timeLeft = 60; // 60 seconds per round

        this.activeAudio = [];

        this.initMap();
        this.bindEvents();
        this.locationHint = "";
        this.scoringMultiplier = 1;
        this.distanceReductionFactor = 1;

        // New start screen elements
        this.createStartScreen();
    }

    startGame() {
        // Select a default character if none selected
        const selectedCharacterEl = document.querySelector('.character-select img[style*="opacity: 1"]') ||
            document.querySelector('.character-select[data-character="cocoa"] img');

        if (selectedCharacterEl) {
            const selectedCharacter = selectedCharacterEl.closest('.character-select').dataset.character;
            this.selectedCharacter = selectedCharacter;

            // Ensure image is styled as selected
            selectedCharacterEl.style.opacity = '1';
            selectedCharacterEl.style.border = '3px solid #FF69B4';
        }

        // Get difficulty from start screen or default to easy
        this.difficulty = document.getElementById('start-difficulty')?.value || 'easy';

        // Disable settings and next round buttons during gameplay
        document.getElementById('settings-btn').style.display = 'none';
        document.getElementById('next-round').style.display = 'none';

        // Initialize game
        this.resetGame();
        this.createRoundResultModal();
        this.startTimer();

        // Apply character ability
        const characterAbility = CHARACTER_ABILITIES[this.selectedCharacter];
        if (characterAbility) {
            characterAbility.modify(this);
            this.showAbilityActivationNotification();
        }
    }

    stopAllSounds() {
        this.activeAudio.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeAudio = []; // Clear the list
    }

    createStartScreen() {
        // Create start screen modal
        const startScreenModal = document.createElement('div');
        startScreenModal.id = 'start-screen-modal';
        startScreenModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        color: white;
        text-align: center;
    `;

        startScreenModal.innerHTML = `
    <div class="start-content" style="
        background-color: rgba(255,255,255,0.1); 
        padding: 40px; 
        border-radius: 20px; 
        text-align: center;
        max-width: 500px;
        width: 90%;
    " data-aos="fade-up">
        <h1 style="font-size: 3em; margin-bottom: 20px;" data-aos="fade-up">Gochiusa Geo Guesser</h1>
        <p style="font-size: 1.2em; margin-bottom: 30px;">Test your geography skills with your favorite Gochiusa characters!</p>
        
        <div class="start-game-settings" style="margin-bottom: 20px;" data-aos="fade-up">
            <h3 data-aos="fade-up">Character Abilities</h3>
            <div class="theme-characters" style="display: flex; justify-content: space-around; margin-bottom: 15px;">
                <div class="character-select" data-character="cocoa" style="text-align: center; cursor: pointer;">
                    <img src="assets/img/chibi/chibi_cocoa.webp" alt="Cocoa" style="width: 80px; height: 80px; border-radius: 50%; opacity: 0.6;">
                    <p>Cocoa</p>
                    <p style="font-size: 0.8em; color: #ddd;">Extra Hint</p>
                    <p style="font-size: 0.7em; color: #aaa;">Provides a helpful location hint at the start of each round</p>
                </div>
                <div class="character-select" data-character="chino" style="text-align: center; cursor: pointer;">
                    <img src="assets/img/chibi/chibi_chino.webp" alt="Chino" style="width: 80px; height: 80px; border-radius: 50%; opacity: 0.6;">
                    <p>Chino</p>
                    <p style="font-size: 0.8em; color: #ddd;">Precision Bonus</p>
                    <p style="font-size: 0.7em; color: #aaa;">Increases points earned for more accurate guesses</p>
                </div>
                <div class="character-select" data-character="rize" style="text-align: center; cursor: pointer;">
                    <img src="assets/img/chibi/chibi_rize.webp" alt="Rize" style="width: 80px; height: 80px; border-radius: 50%; opacity: 0.6;">
                    <p>Rize</p>
                    <p style="font-size: 0.8em; color: #ddd;">Distance Reduction</p>
                    <p style="font-size: 0.7em; color: #aaa;">Reduces the penalty for distance in scoring</p>
                </div>
            </div>
            
            <div>
                <label>Difficulty:
                    <select id="start-difficulty" style="margin-left: 10px;">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
            </div>
        </div>
        
        <button id="start-game-btn" style="
            background-color: #87CEEB; 
            color: white; 
            border: none; 
            padding: 15px 30px; 
            font-size: 1.2em; 
            border-radius: 10px; 
            cursor: pointer;
            transition: all 0.3s ease;
        ">Start Game</button>
    </div>
`;

        document.body.appendChild(startScreenModal);

        const abilityDescriptionEl = document.getElementById('current-ability-text');

        // Manually set the initial text
        abilityDescriptionEl.textContent = "Select a character to see their ability";

        // Character selection logic
        const characterEls = startScreenModal.querySelectorAll('.character-select');
        characterEls.forEach(el => {
            el.addEventListener('click', () => {
                // Remove selected from all
                characterEls.forEach(x => {
                    x.querySelector('img').style.opacity = '0.6';
                    x.querySelector('img').style.border = 'none';
                });

                // Add selected to clicked character
                el.querySelector('img').style.opacity = '1';
                el.querySelector('img').style.border = '3px solid #FF69B4';

                // Get the character
                const character = el.dataset.character;

                const characterAbility = CHARACTER_ABILITIES[character];

                if (characterAbility) {
                    abilityDescriptionEl.textContent = characterAbility.description;
                }
            });
        });

        // Start game button event
        document.getElementById('start-game-btn').addEventListener('click', () => {
            // Get selected character
            const selectedCharacter = document.querySelector('.character-select img[style*="opacity: 1"]')
                .closest('.character-select').dataset.character;

            // Get selected difficulty
            const difficulty = document.getElementById('start-difficulty').value;

            // Set game settings
            this.selectedCharacter = selectedCharacter;
            this.difficulty = difficulty;

            startScreenModal.style.opacity = '0';
            setTimeout(() => {
                startScreenModal.style.display = 'none';
            }, 500);
            this.startGame();
        });
    }

    createRoundResultModal() {
        const modal = document.createElement('div');
        modal.id = 'round-result-modal';
        modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255,255,255,0.9);
        border-radius: 15px;
        padding: 20px;
        width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1500;
        display: none;
    `;

        modal.innerHTML = `
        <div style="text-align: center; " data-aos="fade-up">
            <h2 id="round-result-title">Round Result</h2>
            <p id="round-result-distance" style="margin: 10px 0;">Distance: </p>
            <p id="round-result-points" style="margin: 10px 0;">Points Earned: </p>
            
            <div style="margin-top: 15px;">
                <input type="text" id="social-handle" placeholder="Enter your username" style="
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                ">
                <button id="share-result" style="
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-right: 10px;
                ">Share</button>
                <button id="next-round-modal" style="
                    background-color: #87CEEB;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Next</button>
            </div>
        </div>
    `;

        document.body.appendChild(modal);

        // Share result button
        document.getElementById('share-result').addEventListener('click', () => this.shareResult());

        // Next round button
        document.getElementById('next-round-modal').addEventListener('click', () => {
            document.getElementById('round-result-modal').style.display = 'none';
            this.nextRound();
        });
    }


    initMap() {
        this.map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
        this.guessMarker = null;
    }

    bindEvents() {
        document.getElementById('make-guess').addEventListener('click', () => this.makeGuess());
        document.getElementById('next-round').addEventListener('click', () => this.nextRound());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());

        this.map.on('click', (e) => {
            if (this.guessMarker) this.map.removeLayer(this.guessMarker);
            this.guessMarker = L.marker(e.latlng).addTo(this.map);
        });

        // Character selection
        document.querySelectorAll('.character-select').forEach(el => {
            el.addEventListener('click', () => {
                // Remove selected from all
                document.querySelectorAll('.character-select').forEach(x => {
                    x.classList.remove('selected');
                    x.querySelector('img').style.opacity = '0.6';
                    x.querySelector('img').style.border = 'none';
                });

                // Add selected to clicked character
                el.classList.add('selected');
                el.querySelector('img').style.opacity = '1';
                el.querySelector('img').style.border = '3px solid #FF69B4';

                // Get the character
                const character = el.dataset.character;

                // Update ability description
                const abilityDescriptionEl = document.getElementById('current-ability-text');
                if (abilityDescriptionEl) {
                    const characterAbility = CHARACTER_ABILITIES[character];
                    if (characterAbility) {
                        abilityDescriptionEl.textContent = characterAbility.description;
                    }
                } else {
                    console.warn('Ability description element not found');
                }
            });
        });
    }

    loadLocation() {
        const availableLocations = locations.filter(loc => loc.difficulty === this.difficulty);
        if (availableLocations.length > 0) {
            this.currentLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
            document.getElementById('map-frame').src = this.currentLocation.iframe;
        } else {
            alert("No locations available for the selected difficulty.");
        }
    }

    startGame() {
        // Initialize game
        this.resetGame();
        this.createRoundResultModal();
        this.startTimer();
    }

    startTimer() {
        const timerEl = document.getElementById('timer');
        const timerBarEl = document.getElementById('timer-bar');
        const totalTime = 60;
        let timeRemaining = totalTime;

        // Create audio elements
        const tickSound = new Audio('assets/audio/TippyGGuesser/count.mp3');
        const warningSound = new Audio('assets/audio/TippyGGuesser/warning.mp3');
        const panicSound = new Audio('assets/audio/TippyGGuesser/panic.mp3');

        panicSound.load();

        // Configure audio
        tickSound.loop = true;
        tickSound.volume = 0.9;
        warningSound.volume = 0.5;
        panicSound.volume = 0.7;

        // Track active audio
        this.activeAudio.push(tickSound, warningSound, panicSound);

        tickSound.play();

        if (this.timer) clearInterval(this.timer); // Clear existing timer

        this.timer = setInterval(() => {
            timeRemaining--;

            // Update timer display
            timerEl.textContent = timeRemaining;
            timerBarEl.style.width = `${(timeRemaining / totalTime) * 100}%`;

            if (timeRemaining <= 10) {
                tickSound.playbackRate = 1.5;

                if (timeRemaining % 2 === 0) {
                    console.log('Playing panic sound at timeRemaining:', timeRemaining);
                    panicSound.currentTime = 0;
                    panicSound.play().catch(err => console.error('Error playing panic sound:', err));
                }


                document.body.style.backgroundColor = `rgba(255, 0, 0, ${0.2 + (10 - timeRemaining) * 0.05})`;
                timerEl.style.animation = 'shake 0.5s infinite';
                timerBarEl.style.backgroundColor = 'red';
            } else if (timeRemaining <= 20) {
                tickSound.playbackRate = 1.2;

                if (timeRemaining % 3 === 0) {
                    warningSound.currentTime = 0;
                    warningSound.play();
                }

                timerBarEl.style.backgroundColor = 'orange';
            } else {
                tickSound.playbackRate = 1;
                timerBarEl.style.backgroundColor = '#4CAF50';
                document.body.style.backgroundColor = '';
                timerEl.style.animation = '';
            }

            if (timeRemaining <= 0) {
                this.stopAllSounds(); // Stop all sounds
                clearInterval(this.timer);
                this.timeUp();
            }
        }, 1000);


        // Add CSS for shake animation
        const styleEl = document.createElement('style');
        styleEl.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
        document.head.appendChild(styleEl);
    }

    timeUp() {
        this.stopAllSounds();
        // Automatically make a guess if no marker placed
        if (!this.guessMarker) {
            const bounds = this.map.getBounds();
            const randomLat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
            const randomLng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
            this.guessMarker = L.marker([randomLat, randomLng]).addTo(this.map);
        }

        // Stop all timer sounds
        if (this.tickSound) {
            this.tickSound.pause();
            this.tickSound.currentTime = 0;
        }
        if (this.warningSound) {
            this.warningSound.pause();
            this.warningSound.currentTime = 0;
        }
        if (this.panicSound) {
            this.panicSound.pause();
            this.panicSound.currentTime = 0;
        }

        // Play time up sound
        const timeUpSound = new Audio('assets/audio/TippyGGuesser/timeup.mp3');
        timeUpSound.play();

        // Show time up modal or notification
        const timeUpModal = document.createElement('div');
        timeUpModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 2000;
    `;
        timeUpModal.innerHTML = `
        <h2>Time's Up!</h2>
        <p>Your guess has been automatically placed.</p>
    `;
        document.body.appendChild(timeUpModal);

        // Remove modal after 2 seconds
        setTimeout(() => {
            document.body.removeChild(timeUpModal);
            this.makeGuess();
        }, 2000);

        // Reset body background
        document.body.style.backgroundColor = '';
    }

    makeGuess() {
        this.stopAllSounds(); // Stop all sounds
        clearInterval(this.timer);

        // Stop the timer
        clearInterval(this.timer);

        // Absolutely brutal sound stopping
        try {
            // Stop all audio playback completely
            window.speechSynthesis.cancel(); // Stop any speech synthesis

            // Get ALL audio elements and stop them
            const audioElements = document.getElementsByTagName('audio');
            for (let audio of audioElements) {
                audio.pause();
                audio.currentTime = 0;
            }

            // Additional method to force stop
            const sounds = document.querySelectorAll('audio');
            sounds.forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        } catch (error) {
            console.error("Absolute sound stopping failed:", error);
        }

        // Stop all timer sounds
        if (this.tickSound) {
            this.tickSound.pause();
            this.tickSound.currentTime = 0;
        }
        if (this.warningSound) {
            this.warningSound.pause();
            this.warningSound.currentTime = 0;
        }
        if (this.panicSound) {
            this.panicSound.pause();
            this.panicSound.currentTime = 0;
        }

        // Clear the timer if it's still running
        if (this.timer) {
            clearInterval(this.timer);
        }

        // If no marker placed, randomly place a marker
        if (!this.guessMarker) {
            const bounds = this.map.getBounds();
            const randomLat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
            const randomLng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
            this.guessMarker = L.marker([randomLat, randomLng]).addTo(this.map);
        }

        const { lat, lng } = this.guessMarker.getLatLng();
        const distance = this.calculateDistance(lat, lng, this.currentLocation.lat, this.currentLocation.lng);

        this.updateScore(distance);

        // Add actual location marker
        const actualLocationMarker = L.marker([this.currentLocation.lat, this.currentLocation.lng], {
            icon: L.divIcon({
                className: 'actual-location-marker',
                html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%;"></div>',
                iconSize: [20, 20]
            })
        }).addTo(this.map);

        // Draw a line between guess and actual location
        const polyline = L.polyline([
            [lat, lng],
            [this.currentLocation.lat, this.currentLocation.lng]
        ], {
            color: 'red',
            weight: 2,
            dashArray: '5, 10'
        }).addTo(this.map);

        // Fit the map to show both markers
        this.map.fitBounds([
            [lat, lng],
            [this.currentLocation.lat, this.currentLocation.lng]
        ]);

        // Show round result modal
        const resultModal = document.getElementById('round-result-modal');

        // Ensure roundResults exists and has current round
        if (!this.roundResults || this.roundResults.length < this.round) {
            this.roundResults = this.roundResults || [];
            this.roundResults[this.round - 1] = { points: 0 };
        }

        const roundResult = this.roundResults[this.round - 1];

        document.getElementById('round-result-distance').textContent = `Distance: ${Math.round(distance)} meters`;
        document.getElementById('round-result-points').textContent = `Points Earned: ${roundResult.points}`;
        resultModal.style.display = 'flex';

        this.map.removeLayer(this.guessMarker);
        this.guessMarker = null;
    }

    updateScore(distance) {
        const basePoints = 5000;
        const adjustedDistance = distance * this.distanceReductionFactor;
        const points = Math.max(0, basePoints - Math.round(adjustedDistance / 100)) * this.scoringMultiplier;

        // Store round result
        this.roundResults.push({
            round: this.round,
            location: this.currentLocation.region,
            distance: distance,
            points: Math.round(points)
        });

        this.score += Math.round(points);

        document.getElementById('score').textContent = this.score;
        document.getElementById('round').textContent = this.round;
    }

    shareResult() {
        const handle = document.getElementById('social-handle').value || 'Anonymous';
        const roundResult = this.roundResults[this.round - 1];

        // Create shareable text
        const shareText = `🌍 Gochiusa Geo Guesser Challenge 🎮\n` +
            `Player: ${handle}\n` +
            `Round ${roundResult.round}: ${roundResult.location}\n` +
            `Distance: ${Math.round(roundResult.distance)} meters\n` +
            `Points: ${roundResult.points}\n` +
            `Total Score: ${this.score}\n` +
            `#GochiusaGeoGuesser`;

        // Attempt to use Web Share API
        if (navigator.share) {
            navigator.share({
                title: 'Gochiusa Geo Guesser Result',
                text: shareText
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Result copied to clipboard!');
            });
        }
    }

    showCharacterHint() {
        // Create or update hint element
        let hintElement = document.getElementById('character-hint');
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.id = 'character-hint';
            hintElement.style.backgroundColor = 'rgba(255,255,255,0.8)';
            hintElement.style.padding = '10px';
            hintElement.style.position = 'absolute';
            hintElement.style.top = '10px';
            hintElement.style.left = '10px';
            document.getElementById('street-view').appendChild(hintElement);
        }
        hintElement.textContent = this.locationHint;
    }

    showAbilityActivationNotification() {
        // Create notification element if it doesn't exist
        let notificationEl = document.getElementById('ability-notification');
        if (!notificationEl) {
            notificationEl = document.createElement('div');
            notificationEl.id = 'ability-notification';
            notificationEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            transition: opacity 0.3s;
        `;
            document.body.appendChild(notificationEl);
        }

        // Ensure a character is selected
        if (!this.selectedCharacter) {
            this.selectedCharacter = 'cocoa'; // Default to Cocoa if no character selected
        }

        const characterAbility = CHARACTER_ABILITIES[this.selectedCharacter];

        if (!characterAbility) {
            console.warn('No ability found for character:', this.selectedCharacter);
            return;
        }

        // Set notification text
        notificationEl.textContent = `${characterAbility.name}'s ${characterAbility.ability} activated!`;
        notificationEl.style.opacity = '1';

        // Remove notification after 3 seconds
        setTimeout(() => {
            notificationEl.style.opacity = '0';
        }, 3000);
    }

    nextRound() {
        this.stopAllSounds(); // Stop all sounds before transitioning
        clearInterval(this.timer);
        // Clear previous round's markers and lines
        this.map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                this.map.removeLayer(layer);
            }
        });

        if (this.round < this.maxRounds) {
            this.round++;
            this.loadLocation();
            this.map.setView([0, 0], 2);
            this.startTimer();

            // Reapply character ability
            const characterAbility = CHARACTER_ABILITIES[this.selectedCharacter];
            if (characterAbility) {
                characterAbility.modify(this);
                this.showAbilityActivationNotification();
            }
        } else {
            this.endGame();
        }
    }

    endGame() {
        // Create game over modal
        const gameOverModal = document.createElement('div');
        gameOverModal.id = 'game-over-modal';
        gameOverModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            color: white;
        `;

        // Calculate total stats
        const totalDistance = this.roundResults.reduce((sum, result) => sum + result.distance, 0);
        const averageDistance = totalDistance / this.roundResults.length;

        gameOverModal.innerHTML = `
            <div class="game-over-content" style="
                background-color: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 600px;
            " data-aos="fade-up">
                <h1 style="font-size: 3em; margin-bottom: 20px;">Game Over!</h1>
                <div style="background-color: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px;">
                    <p style="font-size: 1.2em;">Final Score: ${this.score}</p>
                    <p>Average Distance: ${Math.round(averageDistance)} meters</p>
                    <div class="round-summary" data-aos="fade-up">
                        ${this.roundResults.map(result => `
                            <p>Round ${result.round}: ${result.location} - ${Math.round(result.distance)}m (${result.points} pts)</p>
                        `).join('')}
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <input type="text" id="final-social-handle" placeholder="Enter your username" style="
                        width: 100%;
                        padding: 10px;
                        margin-bottom: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    ">
                    <button id="share-final-result" style="
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Share Final Result</button>
                </div>
                <button id="restart-game" style="
                    background-color: #87CEEB;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin-top: 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Restart Game</button>
            </div>
        `;

        document.body.appendChild(gameOverModal);

        // Share final result button
        document.getElementById('share-final-result').addEventListener('click', () => {
            const handle = document.getElementById('final-social-handle').value || 'Anonymous';
            const shareText = `🌍 Gochiusa Geo Guesser Final Result 🏆\n` +
                `Player: ${handle}\n` +
                `Final Score: ${this.score}\n` +
                `Average Distance: ${Math.round(averageDistance)} meters\n` +
                `#GochiusaGeoGuesser #FinalScore`;

            if (navigator.share) {
                navigator.share({
                    title: 'Gochiusa Geo Guesser Final Result',
                    text: shareText
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Final result copied to clipboard!');
                });
            }
        });

        // Restart game button
        document.getElementById('restart-game').addEventListener('click', () => {
            gameOverModal.remove();
            document.getElementById('settings-btn').style.display = 'block';
            document.getElementById('next-round').style.display = 'block';
            this.resetGame();
            this.startGame();
        });
    }

    resetGame() {
        this.score = 0;
        this.round = 1;
        this.roundResults = []; // Reset round results
        document.getElementById('score').textContent = this.score;
        document.getElementById('round').textContent = this.round;
        this.loadLocation();
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    showSettings() {
        document.getElementById('settings-modal').style.display = 'flex';
    }

    saveSettings() {
        this.difficulty = document.getElementById('difficulty').value;

        // Show ability activation
        this.showAbilityActivationNotification();

        // Reset any previous modifications
        this.locationHint = "";
        this.scoringMultiplier = 1;
        this.distanceReductionFactor = 1;

        // Apply character-specific ability
        const selectedCharacter = document.querySelector('.character-select.selected').dataset.character;
        const characterAbility = CHARACTER_ABILITIES[selectedCharacter];

        // Apply new character ability
        if (characterAbility) {
            characterAbility.modify(this);
        }

        document.getElementById('settings-modal').style.display = 'none';

        // Ensure the ability is applied for the current round
        if (this.currentLocation) {
            characterAbility.modify(this);
        }

        this.resetGame();
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {

    // Add timer to the control panel
    const controlPanel = document.querySelector('.control-panel .left-section');
    const timerElement = document.createElement('div');
    timerElement.className = 'timer-container';
    timerElement.style.cssText = `
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        padding: 8px 15px;
        margin-right: 15px;
        display: flex;
        align-items: center;
    `;
    timerElement.innerHTML = `
        <span style="margin-right: 10px; color: var(--cafe-brown); font-weight: bold;">Time:</span>
        <span id="timer" style="color: var(--cafe-brown); font-size: 1.1em;">60</span>
    `;
    controlPanel.insertBefore(timerElement, controlPanel.firstChild);
    window.game = new GochiusaGeoGuesser();
});