// JavaScript for Progressive Image Loading (Blur-up Effect) specific to landing page
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img.lazy-load');

    lazyImages.forEach(img => {
        const fullSrc = img.getAttribute('data-full-src');
        if (fullSrc) {
            // Create a new image object to load the full-res image
            const fullImage = new Image();
            fullImage.src = fullSrc;

            fullImage.onload = () => {
                // When the full image loads, update the original img's src
                img.src = fullSrc;
                // Add 'loaded' class to trigger the CSS transition (unblur/fade in)
                img.classList.add('loaded');
            };

            // Optional: Handle error if full image fails to load
            fullImage.onerror = () => {
                console.error('Failed to load full image:', fullSrc);
                // You might want to show a fallback image or remove the blur anyway
                img.classList.add('loaded'); // Still remove blur to avoid stuck blurred image
            };
        }
    });
});