document.addEventListener('DOMContentLoaded', () => {
    // JavaScript for smooth scrolling when clicking navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute('href'); // Get the target section ID
            if (targetId === '#color-dash-game') {
                // Special handling for the game link, if necessary in the future
                console.log("Attempting to open game immersive:", targetId);
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth' // Smooth scroll effect
                    });
                }
            }
        });
    });

    // JavaScript to dynamically set the current year in the footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // JavaScript for Progressive Image Loading (Blur-up Effect)
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
