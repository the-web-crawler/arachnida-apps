// Global JavaScript for smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor click behavior

        const targetId = this.getAttribute('href'); // Get the target section ID
        // Special handling for the game link, as it opens an immersive
        if (targetId === '#color-dash-game') {
            console.log("Attempting to open game immersive:", targetId);
            // In a real web environment, this might navigate to a new page or open a modal.
            // For this Canvas environment, linking to the immersive ID is the correct way to "open" it.
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

// Global JavaScript to dynamically set the current year in the footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});