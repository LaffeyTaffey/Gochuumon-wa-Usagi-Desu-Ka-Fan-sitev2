fetch('/animewallpaper-proxy')
    .then(response => response.text())
    .then(xml => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const items = xmlDoc.querySelectorAll('item');

        // Get the gallery section element
        const gallerySection = document.getElementById('gallery');

        // Store the original header
        const originalHeader = `<h2 data-aos="fade-up">Gallery</h2>`;
        
        // Clear existing content
        gallerySection.innerHTML = originalHeader;

        items.forEach((item, index) => {
            const titleElement = item.querySelector('title');
            const linkElement = item.querySelector('link');
            const descriptionElement = item.querySelector('description');

            // Log the data to inspect it
            console.log(`Item ${index + 1}:`);
            console.log("Title:", titleElement ? titleElement.textContent : "No title found");
            console.log("Link:", linkElement ? linkElement.textContent : "No link found");
            console.log("Description:", descriptionElement ? descriptionElement.textContent : "No description found");

            // Check if all elements exist
            if (titleElement && linkElement && descriptionElement) {
                const title = titleElement.textContent;
                const link = linkElement.textContent;
                const description = descriptionElement.textContent;

                // Try to extract image URL from description using regex
                let imageUrl;
                const imageUrlMatch = description.match(/https?:\/\/[^ "]+(?:jpg|jpeg|png)/i);
                if (imageUrlMatch) {
                    imageUrl = imageUrlMatch[0];
                }

                // Create a post card for each item (with or without image)
                const postHTML = `
<div class="gallery-card" data-aos="fade-up">
    <a href="${link}" target="_blank" class="gallery-link">
        ${imageUrl ? `<img class="gallery-image" src="${imageUrl}" target="_blank" alt="Post Image" onerror="this.style.display='none';">` : ''}
        <div class="gallery-info">
            <h3 class="gallery-title">${title}</h3>
            <p class="gallery-description">${description}</p>
        </div>
    </a>
</div>
`;
                gallerySection.innerHTML += postHTML;
            } else {
                console.warn(`Skipping item ${index + 1} due to missing elements.`);
            }
        });
    })
    .catch(error => console.error('Error fetching RSS feed:', error));