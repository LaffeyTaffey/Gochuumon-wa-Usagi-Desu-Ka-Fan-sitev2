const fab = document.getElementById('fab');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        fab.style.display = 'flex';
    } else {
        fab.style.display = 'none';
    }
});

fab.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});