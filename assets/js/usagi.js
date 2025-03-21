// Set initial theme
document.addEventListener('DOMContentLoaded', () => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (currentTheme == 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    updateThemeToggleIcon();
});

// Function to update theme toggle icon
function updateThemeToggleIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Scroll handling
let lastScrollTop = 0;
const header = document.querySelector('.header-nav');
const title = document.querySelector('.site-title');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.classList.add('hidden');
        title.style.opacity = '0';
    } else {
        header.classList.remove('hidden');
        title.style.opacity = '1';
    }

    lastScrollTop = scrollTop;
});

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon();
    showNotification(`Switched to ${newTheme} mode`);
});

// Back button
const backButton = document.querySelector('.back-button');
backButton.addEventListener('click', () => {
    window.history.back();
});

// Navigation link animations
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default navigation
        const href = link.getAttribute('href');
        showNotification(`Navigating to ${href.substring(1)}`);
        // Delay navigation to allow the notification to show
        setTimeout(() => {
            window.location.href = href;
        }, 2000);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Dropdown functionality for desktop
    const dropdownContainers = document.querySelectorAll('.dropdown-container');

    dropdownContainers.forEach(container => {
        const dropdownToggle = container.querySelector('.dropdown-toggle');
        const dropdownMenu = container.querySelector('.dropdown-menu');

        // Hover event for desktop
        container.addEventListener('mouseenter', () => {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
            dropdownMenu.style.transform = 'translateY(0)';
        });

        container.addEventListener('mouseleave', () => {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
            dropdownMenu.style.transform = 'translateY(-10px)';
        });

        // Click event for mobile/touch devices
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });
    });
});

// Notification system
function showNotification(message) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 500);
}

document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
    offset: 100,
    delay: 50,
    duration: 600,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    once: true,
    mirror: false,
    anchorPlacement: 'top-bottom',
    startEvent: 'DOMContentLoaded',
    disableMutationObserver: false,
    throttleDelay: 99,
    debounceDelay: 50
});
    const staffImages = document.querySelectorAll('.staff-image[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    staffImages.forEach(img => imageObserver.observe(img));

    // Event delegation for hover effects
    document.querySelector('.staff-section').addEventListener('mouseover', (e) => {
        const card = e.target.closest('.staff-card');
        if (card) card.classList.add('hover');
    });

    document.querySelector('.staff-section').addEventListener('mouseout', (e) => {
        const card = e.target.closest('.staff-card');
        if (card) card.classList.remove('hover');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize mobile nav if screen is mobile
    if (window.innerWidth <= 768) {
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
        const hamburgerIcon = document.querySelector('.hamburger-icon');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        mobileNavToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.toggle('open');
            hamburgerIcon.classList.toggle('open');
        });

        // Close nav when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('open');
                hamburgerIcon.classList.remove('open');
            });
        });

        // Close nav when clicking outside
        mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                mobileNavOverlay.classList.remove('open');
                hamburgerIcon.classList.remove('open');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Dropdown functionality for desktop
    const dropdownContainers = document.querySelectorAll('.dropdown-container');

    dropdownContainers.forEach(container => {
        const dropdownToggle = container.querySelector('.dropdown-toggle');
        const dropdownMenu = container.querySelector('.dropdown-menu');

        // Hover events for desktop
        container.addEventListener('mouseenter', () => {
            dropdownMenu.classList.add('show');
        });

        container.addEventListener('mouseleave', () => {
            dropdownMenu.classList.remove('show');
        });
    });
});

window.addEventListener('resize', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    if (window.innerWidth > 768) {
        if (mobileNavToggle) mobileNavToggle.style.display = 'none';
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
        if (hamburgerIcon) hamburgerIcon.classList.remove('open');
    } else {
        if (mobileNavToggle) mobileNavToggle.style.display = 'block';
    }
});