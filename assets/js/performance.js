const logImageLoadTimes = () => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        const start = performance.now();
        img.onload = () => {
            const duration = performance.now() - start;
            console.log(`Image: ${img.src}, Load Time: ${duration.toFixed(2)} ms`);
        };
        img.onerror = () => {
            console.log(`Image: ${img.src}, Load Error`);
        };
    });
};

// Call the function to log image load times
logImageLoadTimes();