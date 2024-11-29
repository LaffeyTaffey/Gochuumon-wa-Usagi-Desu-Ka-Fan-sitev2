document.addEventListener("DOMContentLoaded", function () {
    const parallaxContainer = document.querySelector('.parallax-container');
    const popupSection = document.getElementById('popup-section');
    const video1 = document.querySelector('.background-video-parallax');
    const video2 = document.querySelector('.background-video-parallax-2');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const videos = [video1, video2].filter(Boolean); // Remove any null videos

    // Consolidated Viewport Check
    function isElementInViewport(el, threshold = 0.2) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold &&
            rect.left <= windowWidth &&
            rect.right >= 0
        );
    }

    // Unified Video Playback Management
    function manageVideoPlayback() {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
            // Disable videos on mobile
            videos.forEach(video => {
                if (video) {
                    video.pause();
                    video.src = ''; // Prevent loading
                }
            });
            return;
        }

        // Video 1 (Parallax Container)
        if (video1) {
            isElementInViewport(parallaxContainer)
                ? video1.play().catch(handleVideoError)
                : video1.pause();
        }

        // Video 2 (Popup Section)
        if (video2) {
            isElementInViewport(popupSection)
                ? video2.play().catch(handleVideoError)
                : video2.pause();
        }
    }

    // Error Handling for Video Playback
    function handleVideoError(error) {
        console.error('Video Playback Error:', error);
    }

    // Debounce Utility
    function debounce(func, wait = 50) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Performance Logging (from performance.js)
    function logScriptLoadTimes() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach((script) => {
            const start = performance.now();
            script.onload = () => {
                const duration = performance.now() - start;
                console.log(`Script: ${script.src}, Load Time: ${duration.toFixed(2)} ms`);
            };
            script.onerror = () => {
                console.log(`Script: ${script.src}, Load Error`);
            };
        });
    }

    // Lazy Image Loading (from performance.js)
    function setupLazyLoading() {
        // Ensure Lottie is loaded
        if (typeof lottie === 'undefined') {
            console.error('Lottie library not loaded');
            return;
        }

        const defaultLottiePlaceholder = 'assets/img/placeholder.json';
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const lottieContainer = document.createElement('div');

                    // Set default placeholder if not specified
                    const placeholderPath = img.dataset.lottieplaceholder || defaultLottiePlaceholder;

                    // Preserve original image attributes and styles
                    const originalWidth = img.width || img.offsetWidth;
                    const originalHeight = img.height || img.offsetHeight;
                    const originalClasses = img.className;

                    // Style the Lottie container to match image
                    lottieContainer.style.width = `${originalWidth}px`;
                    lottieContainer.style.height = `${originalHeight}px`;
                    lottieContainer.style.display = 'inline-block';
                    lottieContainer.className = originalClasses;

                    // Replace image with Lottie container
                    img.parentNode.insertBefore(lottieContainer, img);
                    img.style.display = 'none';
                    img.style.opacity = '0';

                    // Render Lottie animation
                    const lottieAnimation = lottie.loadAnimation({
                        container: lottieContainer,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: placeholderPath
                    });

                    // Preload actual image
                    const loadingImage = new Image();

                    loadingImage.onload = () => {
                        // Stop Lottie animation
                        lottieAnimation.destroy();
                        lottieContainer.remove();

                        // Show actual image
                        img.style.display = 'block';
                        img.style.opacity = '1';
                        img.src = loadingImage.src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                    };

                    loadingImage.onerror = () => {
                        console.error(`Failed to load image: ${img.dataset.src}`);
                        // Remove placeholder and show original image
                        lottieAnimation.destroy();
                        lottieContainer.remove();
                        img.style.display = 'block';
                        img.style.opacity = '1';
                    };

                    // Trigger image loading
                    loadingImage.src = img.dataset.src;

                    // Stop observing
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe images
        lazyImages.forEach(img => {
            // Ensure initial setup
            img.style.opacity = '0';
            imageObserver.observe(img);
        });
    }

    // Ensure Lottie is loaded before setup
    function initLazyLoading() {
        if (window.lottie) {
            setupLazyLoading();
        } else {
            // Dynamically load Lottie if not present
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.14/lottie.min.js';
            script.onload = setupLazyLoading;
            document.head.appendChild(script);
        }
    }

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', initLazyLoading);

    // Parallax Effect
    function setupParallaxEffect() {
        let rafId = null;
        const handleMouseMove = (e) => {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                if (!isElementInViewport(parallaxContainer)) return;

                parallaxLayers.forEach(layer => {
                    const speed = parseFloat(layer.dataset.speed);
                    const x = (e.pageX * speed) / 50 + (layer.classList.contains('layer-2') ? window.innerWidth * 0.1 : 0);
                    const y = (e.pageY * speed) / 50;

                    layer.style.transform = `translate(${x}px, ${y}px)`;
                });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
    }

    // Event Listeners
    const debouncedVideoPlayback = debounce(manageVideoPlayback);
    window.addEventListener('scroll', debouncedVideoPlayback);
    window.addEventListener('resize', debouncedVideoPlayback);

    // Tab Visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            videos.forEach(video => video?.pause());
        } else {
            manageVideoPlayback();
        }
    });

    // Initialize
    logScriptLoadTimes();
    setupLazyLoading();
    setupParallaxEffect();
    manageVideoPlayback();
});