const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Set initial theme
const setInitialTheme = () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);
};

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Initialize the theme on page load
document.addEventListener('DOMContentLoaded', setInitialTheme);