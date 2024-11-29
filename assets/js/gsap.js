document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(".loading-overlay");

    // Initial page load: Slide down and fade out
    gsap.fromTo(overlay,
        { opacity: 1, y: 0, scale: 1 },
        {
            duration: 1,
            opacity: 0,
            y: -100,
            scale: 0.95,
            pointerEvents: "none",
            onComplete: () => overlay.style.display = "none"
        }
    );

    // Add transition effect for all links
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');

            if (href.startsWith('#')) {
                // Handle internal links
                event.preventDefault();
                overlay.style.display = "flex";
                gsap.fromTo(overlay,
                    { opacity: 0, y: 100, scale: 1.05 },
                    { duration: 0.5, opacity: 1, y: 0, scale: 1 }
                );

                const target = document.querySelector(href);
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                    gsap.to(overlay, {
                        duration: 0.5,
                        opacity: 0,
                        y: -100,
                        scale: 0.95,
                        pointerEvents: "none",
                        onComplete: () => overlay.style.display = "none"
                    });
                }, 500);
            } else {
                // Handle external links
                event.preventDefault();
                overlay.style.display = "flex";
                gsap.fromTo(overlay,
                    { opacity: 0, y: 100, scale: 1.05 },
                    { duration: 0.7, opacity: 1, y: 0, scale: 1 }
                );

                setTimeout(() => {
                    window.location.href = href;
                }, 700);
            }
        });
    });
});