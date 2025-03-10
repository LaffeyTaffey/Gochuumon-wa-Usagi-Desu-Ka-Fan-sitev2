document.getElementById('irl-gochiuma-locations').addEventListener('mousemove', (e) => {
    const sliderWrapper = e.target.closest('.slider-wrapper');
    if (!sliderWrapper) return; // Exit if not in a slider

    const sliderHandle = sliderWrapper.querySelector('.slider-handle');
    const animeImage = sliderWrapper.querySelector('.anime-image');

    const rect = sliderWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max((x / sliderWrapper.offsetWidth) * 100, 0), 100);

    sliderHandle.style.left = `${percentage}%`;
    animeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0`;
});

async function loadImages(imageArray) {
    const promises = imageArray.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;

            img.onload = () => resolve(img);
            img.onerror = (error) => {
                // Send an error to the server
                fetch('/log-error', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ error: `Failed to load image: ${src}`, details: error }),
                });
                reject(new Error(`Failed to load image: ${src}`));
            };
        });
    });
    return Promise.all(promises);
}

try {
    if (typeof imageData !== 'undefined' && Array.isArray(imageData)) {
        imageData.forEach((data, index) => {
            const sliderHTML = `
                <div class="slider-container" data-aos="fade-up">
                    <div class="slider-wrapper">
                        <div class="slider-image anime-image">
                            <img src="${data.anime[0]}" alt="Anime Location">
                        </div>
                        <div class="slider-image irl-photo">
                            <img src="${data.irl}" alt="Real-life Location">
                        </div>
                        <div class="slider-handle"></div>
                    </div>
                </div>`;
            document.getElementById('irl-gochiuma-locations').insertAdjacentHTML('beforeend', sliderHTML);
        });
    } else {
        // Silently ignore this specific case
        // console.warn('imageData is not defined or not an array.');
    }
} catch (error) {
    // Catch any other unexpected errors, but don't log the specific ones you want to ignore
    if (error.message.includes('imageData is not defined')) {
        // console.log('ImageData error suppressed');
    } else {
        console.error(error); // For other errors, you can still log them
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImagelocations');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');

    // Function to open modal
    function openImageModal(imgSrc, altText) {
        imageModal.style.display = "block";
        modalImage.src = imgSrc;
        modalCaption.innerHTML = altText;
    }

    // Function to close modal
    function closeImageModal() {
        imageModal.style.display = "none";
    }

    // Add click event to static images
    const staticAnimeImages = document.querySelectorAll('.static-anime-image img');
    const staticIrlPhotos = document.querySelectorAll('.static-irl-photo img');

    // Combine both image sets
    const allStaticImages = [...staticAnimeImages, ...staticIrlPhotos];

    allStaticImages.forEach(img => {
        img.style.cursor = 'pointer'; // Show it's clickable
        img.addEventListener('click', (e) => {
            openImageModal(e.target.src, e.target.alt);
        });
    });

    // Close modal when clicking on close button
    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling
            closeImageModal();
        });
    }

    // Close modal when clicking outside the image
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.style.display === 'block') {
            closeImageModal();
        }
    });
});