class ButtonSoundEffects {
    constructor() {
        // Create audio elements for different button sounds
        this.clickSound = new Audio('assets/audio/buttonEffects/button-202966.mp3');
        this.hoverSound = new Audio('assets/audio/buttonEffects/click-buttons-ui-menu-sounds-effects-button-2-203594.mp3');
        this.backSound = new Audio('assets/audio/buttonEffects/old-radio-button-click-97549.mp3');
        this.tabSound = new Audio('assets/audio/buttonEffects/switch-150130.mp3');
        
        this.initializeButtons();
    }

    initializeButtons() {
        // unmute
        document.querySelectorAll('unmute-button').forEach(button => {
            this.addButtonEffects(button, this.clickSound);
        });
        // Navigation buttons
        document.querySelectorAll('nav a').forEach(button => {
            this.addButtonEffects(button, this.clickSound);
        });

        // Control buttons
        document.querySelectorAll('.nav-controls button').forEach(button => {
            this.addButtonEffects(button, this.clickSound);
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn, .entry-tab-btn, .tab-button').forEach(button => {
            this.addButtonEffects(button, this.tabSound);
        });

        // Video control buttons
        document.querySelectorAll('.control-btn').forEach(button => {
            this.addButtonEffects(button, this.clickSound);
        });

        // Music player buttons
        document.querySelectorAll('.music-player-panel button').forEach(button => {
            this.addButtonEffects(button, this.clickSound);
        });

        // Social share buttons
        document.querySelectorAll('.share-btn').forEach(button => {
            this.addButtonEffects(button, this.clickSound);
        });

        // FAB button
        const fab = document.getElementById('fab');
        if (fab) this.addButtonEffects(fab, this.clickSound);

        // Start button
        const startButton = document.getElementById('start-button');
        if (startButton) this.addButtonEffects(startButton, this.clickSound);

        // Quiz buttons
        document.querySelectorAll('#quiz-container button').forEach(button => {
            this.addButtonEffects(button, this.clickSound);
        });

        // Back button
        const backButton = document.querySelector('.back-button');
        if (backButton) this.addButtonEffects(backButton, this.backSound);

        // Mood buttons
        document.querySelectorAll('.mood-btn').forEach(button => {
            this.addButtonEffects(button, this.clickSound);
        });
    }

    addButtonEffects(button, sound) {
        // Hover effect
        button.addEventListener('mouseenter', () => {
            this.hoverSound.currentTime = 0;
            this.hoverSound.play();
        });

        // Click effect
        button.addEventListener('click', () => {
            sound.currentTime = 0;
            sound.play();
        });
    }
}

// Initialize button sound effects when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ButtonSoundEffects();
});