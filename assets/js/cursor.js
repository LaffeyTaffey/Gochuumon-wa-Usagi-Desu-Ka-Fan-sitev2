const cursor = document.querySelector('.custom-cursor');
const isMobile = window.innerWidth <= 768;

// Hide cursor on mobile
if (isMobile) {
    cursor.style.display = 'none'; // Hide the custom cursor
} else {
    cursor.style.display = 'block'; // Show the custom cursor

    // Only add the custom cursor if not on mobile
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}