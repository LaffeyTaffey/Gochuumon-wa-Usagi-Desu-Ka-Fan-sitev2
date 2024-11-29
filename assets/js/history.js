document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const hiddenItems = document.querySelectorAll('.timeline-item.hidden');
    let isExpanded = false;

    showMoreBtn.addEventListener('click', function() {
        if (!isExpanded) {
            hiddenItems.forEach(item => {
                item.classList.remove('hidden');
                item.setAttribute('data-aos', 'fade-up');
                AOS.refresh(); // Refresh AOS to trigger animations on newly visible elements
            });
            showMoreBtn.textContent = 'Show Less';
            isExpanded = true;
        } else {
            hiddenItems.forEach(item => {
                item.classList.add('hidden');
            });
            showMoreBtn.textContent = 'Show More';
            isExpanded = false;
            // Scroll back to the history section
            document.getElementById('history').scrollIntoView({behavior: 'smooth'});
        }
    });
});