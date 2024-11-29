// staffs.js
// Add event listeners to staff cards
document.querySelectorAll('.staff-card').forEach((card) => {
    card.addEventListener('mouseover', () => {
        card.classList.add('hover');
    });
    
    card.addEventListener('mouseout', () => {
        card.classList.remove('hover');
    });
});

// Add animation to staff section headers
document.querySelectorAll('.staff-section-header').forEach((header) => {
    header.addEventListener('mouseover', () => {
        header.classList.add('animate');
    });
    
    header.addEventListener('mouseout', () => {
        header.classList.remove('animate');
    });
});

// Add animation to staff images
document.querySelectorAll('.staff-image').forEach((image) => {
    image.addEventListener('mouseover', () => {
        image.classList.add('animate');
    });
    
    image.addEventListener('mouseout', () => {
        image.classList.remove('animate');
    });
});