document.addEventListener('DOMContentLoaded', function() {
    const entryTabBtns = document.querySelectorAll('.entries-tabs .entry-tab-btn');
    const entryContentPanels = document.querySelectorAll('.entries-content');

    // Show initial content
    const initialContent = document.querySelector('.entries-content.entry-active');
    if (initialContent) {
        initialContent.style.display = 'block';
        initialContent.style.opacity = '1';
        initialContent.style.transform = 'translateY(0)';
    }

    function animateEntries(element) {
        const entries = element.querySelectorAll('.entry-card');
        entries.forEach((entry, index) => {
            setTimeout(() => {
                entry.style.opacity = '1';
                entry.style.transform = 'translateY(0)';
            }, index * 100); // Stagger the animations
        });
    }

    entryTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            entryTabBtns.forEach(b => b.classList.remove('entry-active'));
            btn.classList.add('entry-active');
            
            const contentId = btn.getAttribute('data-tab');
            const newContent = document.getElementById(contentId);
            
            const currentActiveContent = document.querySelector('.entries-content.entry-active');
            if (currentActiveContent) {
                currentActiveContent.style.opacity = '0';
                currentActiveContent.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    currentActiveContent.classList.remove('entry-active');
                    currentActiveContent.style.display = 'none';
                    
                    newContent.style.display = 'block';
                    newContent.classList.add('entry-active');
                    
                    newContent.offsetHeight; // Force reflow
                    
                    newContent.style.opacity = '1';
                    newContent.style.transform = 'translateY(0)';
                    
                    animateEntries(newContent);
                }, 300);
            } else {
                newContent.style.display = 'block';
                newContent.classList.add('entry-active');
                newContent.style.opacity = '1';
                newContent.style.transform = 'translateY(0)';
                
                animateEntries(newContent);
            }
        });
    });

    // Entry card click handler
    document.querySelectorAll('.entry-card').forEach(card => {
        card.addEventListener('click', () => {
            const seasonId = card.closest('.entries-content').id;
            document.getElementById('watch').scrollIntoView({ behavior: 'smooth' });
            
            if (typeof updateVideoPlayer === 'function') {
                updateVideoPlayer(seasonId);
            }
        });
    });

    // Initial animation for the active tab
    animateEntries(initialContent);
});