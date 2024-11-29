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
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
        });
    });
    return Promise.all(promises);
}

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