// shimmerEffect.js

function addShimmerEffectAndLazyLoading() {
    const images = document.querySelectorAll('img');

    // Add loading="lazy" to all images
    images.forEach(image => {
        if (!image.hasAttribute('loading')) {
            image.setAttribute('loading', 'lazy');
        }
    });

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                
                // Create shimmer if not already exists
                let shimmer = image.previousElementSibling;
                if (!shimmer || !shimmer.classList.contains('shimmer')) {
                    shimmer = document.createElement('div');
                    shimmer.classList.add('shimmer');
                    image.parentElement.insertBefore(shimmer, image);
                }

                // Artificial delay to ensure shimmer is visible
                const artificialDelay = new Promise(resolve => {
                    // Minimum delay of 300ms, even on fast connections
                    setTimeout(resolve, 300);
                });

                // Image loading promise
                const imageLoadPromise = new Promise(resolve => {
                    // Ensure image is fully loaded
                    if (image.complete) {
                        resolve();
                    } else {
                        image.addEventListener('load', resolve);
                        image.addEventListener('error', resolve);
                    }
                });

                // Wait for both artificial delay and image load
                Promise.all([artificialDelay, imageLoadPromise])
                    .then(() => {
                        removeShimmer(shimmer);
                    });

                // Stop observing this image
                observer.unobserve(image);
            }
        });
    }, {
        rootMargin: '50px' // Start loading slightly before entering viewport
    });

    // Helper function to remove shimmer
    function removeShimmer(shimmer) {
        if (shimmer) {
            shimmer.style.opacity = '0';
            setTimeout(() => {
                shimmer.remove();
            }, 300);
        }
    }

    // Observe all images
    images.forEach(image => {
        imageObserver.observe(image);
    });
}

// Initialize shimmer effect and lazy loading when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', addShimmerEffectAndLazyLoading);