document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    // UUID Generator
    const generateUuidBtn = document.getElementById('generateUuidBtn');
    const copyUuidBtn = document.getElementById('copyUuidBtn');
    const uuidOutput = document.getElementById('uuidOutput');

    // Dice Roller
    const rollDiceBtn = document.getElementById('rollDiceBtn');
    const numDiceInput = document.getElementById('numDice');
    const diceTypeSelect = document.getElementById('diceType');
    const diceResultDiv = document.getElementById('diceResult');

    // --- Helper Functions ---
    /**
     * Applies a CSS animation class to an element and removes it after the animation ends
     * to allow it to be re-triggered.
     * @param {HTMLElement} element The HTML element to animate.
     * @param {string} animationClass The CSS class that applies the animation.
     */
    function applyAnimation(element, animationClass = 'result-highlight') {
        element.classList.remove(animationClass); // Remove class if already present
        void element.offsetWidth; // Trigger reflow to restart animation
        element.classList.add(animationClass);
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    }

    // --- UUID Generator ---
    function generateUuid() {
        uuidOutput.value = crypto.randomUUID();
        applyAnimation(uuidOutput);
    }

    function copyUuid() {
        if (!uuidOutput.value) {
            alert('Please generate a UUID first.');
            return;
        }
        navigator.clipboard.writeText(uuidOutput.value)
            .then(() => {
                const originalText = copyUuidBtn.textContent;
                copyUuidBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyUuidBtn.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('Failed to copy UUID: ', err);
                alert('Failed to copy UUID. See console for details.');
            });
    }

    if (generateUuidBtn) {
        generateUuidBtn.addEventListener('click', generateUuid);
    }

    if (copyUuidBtn) {
        copyUuidBtn.addEventListener('click', copyUuid);
    }

    // --- Dice Roller ---
    function rollDice() {
        const numDice = parseInt(numDiceInput.value, 10);
        const typeOfDie = parseInt(diceTypeSelect.value, 10);

        if (isNaN(numDice) || numDice <= 0) {
            alert('Please enter a valid, positive number of dice.');
            diceResultDiv.innerHTML = '<p class="placeholder">Enter a valid number of dice.</p>';
            return;
        }
        if (numDice > 100) { // Basic limit to prevent performance issues
            alert('Maximum 100 dice allowed.');
            diceResultDiv.innerHTML = '<p class="placeholder">Max 100 dice.</p>';
            return;
        }


        let rolls = [];
        let sum = 0;

        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * typeOfDie) + 1;
            rolls.push(roll);
            sum += roll;
        }

        let resultHTML = `<p>Rolls: [${rolls.join(', ')}]</p>`;
        if (numDice > 1) { // Only show sum if more than one die
            resultHTML += `<p>Total: ${sum}</p>`;
        }

        diceResultDiv.innerHTML = resultHTML;
        applyAnimation(diceResultDiv);
    }

    if (rollDiceBtn) {
        rollDiceBtn.addEventListener('click', rollDice);
    }

    // --- Footer Year (already in HTML, but good to have all JS here if preferred eventually) ---
    // This script is also present inline in apps/random-event-generator/index.html
    // To avoid duplication, it's better to remove the inline one if this script file is guaranteed to load.
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        // Check if the content is already set (by the inline script)
        // This is a temporary measure. Ideally, remove the inline script.
        if (!currentYearElement.textContent.includes(new Date().getFullYear().toString())) {
             currentYearElement.textContent = new Date().getFullYear();
        }
    }
});
