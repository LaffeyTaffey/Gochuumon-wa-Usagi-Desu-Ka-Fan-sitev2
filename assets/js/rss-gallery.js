document.addEventListener('DOMContentLoaded', () => {
    const gallerySection = document.getElementById('gallery');
    const characters = ['chino', 'cocoa', 'chiya', 'syaro', 'mocha', 'main'];
    let currentCharacter = 'chino';
    let allItems = [];
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;

    function createCharacterButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('character-buttons');

        characters.forEach(character => {
            const button = document.createElement('button');
            // Special display name for 'main'
            button.textContent = character === 'main' ? 'Main Gallery' :
                character.charAt(0).toUpperCase() + character.slice(1);
            button.classList.add('character-button');

            if (character === currentCharacter) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttonContainer.querySelectorAll('.character-button').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                button.classList.add('active');

                loadCharacterGallery(character);
            });

            buttonContainer.appendChild(button);
        });

        // Clear existing content and add buttons
        gallerySection.innerHTML = `
            <h2 data-aos="fade-up">
                ${currentCharacter === 'main' ? 'Main' :
                (currentCharacter.charAt(0).toUpperCase() + currentCharacter.slice(1))} Gallery
            </h2>
        `;
        gallerySection.appendChild(buttonContainer);
    }

    function createGalleryGrid() {
        const grid = document.createElement('div');
        grid.classList.add('gallery-grid');
        grid.id = 'gallery-grid';
        gallerySection.appendChild(grid);
    }

    function loadCharacterGallery(character) {
        currentCharacter = character;
        currentPage = 1;

        // Different fetch URL for main gallery
        const fetchUrl = character === 'main'
            ? '/animewallpaper-proxy'
            : `/character-gallery/${character}`;

        fetch(fetchUrl)
            .then(response => response.text())
            .then(xml => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xml, 'application/xml');
                allItems = Array.from(xmlDoc.querySelectorAll('item'));

                createCharacterButtons();
                createGalleryGrid();
                renderGalleryItems();
                addPaginationControls();
            })
            .catch(error => {
                console.error('Error fetching RSS feed:', error);
                gallerySection.innerHTML += `
                    <p class="error-message">
                        Unable to load gallery. Please try again later.
                    </p>
                `;
            });
    }

    function extractImageUrl(description) {
        // Multiple strategies to extract image URL
        const imageUrlPatterns = [
            // Reddit media CDN with preview URLs
            /https?:\/\/preview\.redd\.it\/[^ "]+(?:\?width=\d+&crop=smart&auto=webp)?/i,
            // Direct image URL regex
            /https?:\/\/[^ "]+(?:jpg|jpeg|png|gif|webp)/i,
            // Imgur and other CDNs
            /https?:\/\/(?:i\.)?imgur\.com\/[^ "]+/i,
            // Other common image hosting patterns
            /https?:\/\/[^ "]+\/(?:uploads|media)\/[^ "]+(?:jpg|jpeg|png|gif|webp)/i
        ];

        for (let pattern of imageUrlPatterns) {
            const match = description.match(pattern);
            if (match) {
                let url = match[0];

                // Clean up Reddit preview URLs
                if (url.includes('preview.redd.it')) {
                    // Remove duplicate width parameters
                    url = url.replace(/\?width=\d+&crop=smart&auto=webp\?width=\d+&crop=smart&auto=webp&s=/, '?width=960&crop=smart&auto=webp&s=');

                    // Ensure the URL has width and crop parameters
                    if (!url.includes('?width=')) {
                        url += '?width=960&crop=smart&auto=webp&s=';
                    }
                }

                return url;
            }
        }
        return null;
    }

    function renderGalleryItems() {
        const galleryGrid = document.getElementById('gallery-grid');
        galleryGrid.innerHTML = ''; // Clear previous items

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const itemsToRender = allItems.slice(startIndex, endIndex);

        itemsToRender.forEach((item, index) => {
            const titleElement = item.querySelector('title');
            const linkElement = item.querySelector('link');
            const descriptionElement = item.querySelector('description');

            if (titleElement && linkElement && descriptionElement) {
                const title = titleElement.textContent;
                const link = linkElement.textContent;
                const description = descriptionElement.textContent;

                const imageUrl = extractImageUrl(description);

                const postHTML = `
                <div class="gallery-card" data-aos="zoom-in">
                    <a href="${link}" target="_blank" class="gallery-link">
                        ${imageUrl ? `
                        <img class="gallery-image lazy-load" 
                             data-src="${imageUrl}" 
                             alt="${title}" 
                             onload="this.classList.add('loaded')"
                             onerror="handleImageError(this)"
                             loading="lazy">
                        ` : ''}
                        <div class="gallery-info">
                            <h3 class="gallery-title">${title}</h3>
                        </div>
                    </a>
                </div>`;

                galleryGrid.innerHTML += postHTML;
            }
        });

        window.handleImageError = function (img) {
            console.error('Image failed to load:', img.dataset.src);
            img.classList.add('image-error');

            // Log error to server with more details
            fetch('/log-error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: 'Image Loading Failed',
                    details: {
                        src: img.dataset.src,
                        alt: img.alt,
                        naturalWidth: img.naturalWidth,
                        naturalHeight: img.naturalHeight
                    }
                })
            });
        };

        initLazyLoading();
    }

    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.gallery-image.lazy-load');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    function addPaginationControls() {
        const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

        // Remove existing pagination controls
        const existingControls = document.querySelector('.pagination-controls');
        if (existingControls) {
            existingControls.remove();
        }

        // Only add controls if we have more than one page
        if (totalPages > 1) {
            const paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination-controls');

            // Previous button
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&#8592; Previous'; // Left arrow
            prevButton.classList.add('show-more-btn');
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderGalleryItems();
                    updatePaginationControls();
                    window.scrollTo({ top: gallerySection.offsetTop, behavior: 'smooth' });
                }
            });

            // Next button
            const nextButton = document.createElement('button');
            nextButton.innerHTML = 'Next &#8594;'; // Right arrow
            nextButton.classList.add('show-more-btn');
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderGalleryItems();
                    updatePaginationControls();
                    window.scrollTo({ top: gallerySection.offsetTop, behavior: 'smooth' });
                }
            });

            // Page info
            const pageInfo = document.createElement('span');
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            pageInfo.classList.add('page-info');

            paginationContainer.appendChild(prevButton);
            paginationContainer.appendChild(pageInfo);
            paginationContainer.appendChild(nextButton);

            gallerySection.appendChild(paginationContainer);
        }
    }

    function updatePaginationControls() {
        const prevButton = document.querySelector('.pagination-controls button:first-child');
        const nextButton = document.querySelector('.pagination-controls button:last-child');
        const pageInfo = document.querySelector('.page-info');
        const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Initial load
    createCharacterButtons();
    createGalleryGrid();
    loadCharacterGallery('chino');
});