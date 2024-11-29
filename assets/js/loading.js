const loadingOverlay = document.querySelector('.loading-overlay');

function showLoading() {
    loadingOverlay.style.display = 'block';
    setTimeout(() => loadingOverlay.style.opacity = '1', 10);
}

function hideLoading() {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => loadingOverlay.style.display = 'none', 300);
}

// Show loading overlay only during initial page load
document.addEventListener('DOMContentLoaded', hideLoading);

// Show loading overlay when clicking navigation links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        // Only show loading if it's a section link
        if (targetId.startsWith('#')) {
            showLoading();
            
            setTimeout(() => {
                hideLoading();
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }, 500);
        }
    });
});

// Show loading overlay when using the FAB (Floating Action Button)
document.getElementById('fab').addEventListener('click', () => {
    showLoading();
    setTimeout(() => {
        hideLoading();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
});

// Optional: Show loading overlay during page transitions
window.addEventListener('beforeunload', showLoading);