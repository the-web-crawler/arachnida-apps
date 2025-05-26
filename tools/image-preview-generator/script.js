// JavaScript specific to the Image to Low-Res Data URI Converter page

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const targetWidthInput = document.getElementById('targetWidth');
    const targetHeightInput = document.getElementById('targetHeight');
    const jpegQualityInput = document.getElementById('jpegQuality');

    const currentWidthValue = document.getElementById('currentWidthValue');
    const currentHeightValue = document.getElementById('currentHeightValue');
    const currentQualityValue = document.getElementById('currentQualityValue');

    const outputSection = document.getElementById('outputSection');
    const outputImagePreview = document.getElementById('outputImagePreview');
    const dataUriOutput = document.getElementById('dataUriOutput');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton'); // Get download button
    const imageCanvas = document.getElementById('imageCanvas');
    const ctx = imageCanvas.getContext('2d');

    let uploadedImage = null; // Store the uploaded image data for re-processing
    let currentBlob = null; // Store the current Blob for download

    // Function to process and display the image
    function processImage() {
        if (!uploadedImage) {
            outputSection.classList.add('hidden');
            return;
        }

        // Ensure the output section is visible early to prevent layout shifts
        outputSection.classList.remove('hidden');
        dataUriOutput.textContent = 'Processing image...';
        outputImagePreview.src = ''; // Clear previous preview
        outputImagePreview.style.backgroundColor = '#f0f0f0'; // Add a temporary background for loading state
        downloadButton.classList.add('hidden'); // Hide download button while processing

        // Read user-defined values from inputs
        const userTargetWidth = Math.max(1, parseInt(targetWidthInput.value, 10) || 20);
        const userTargetHeight = Math.max(1, parseInt(targetHeightInput.value, 10) || 20);
        const userJpegQuality = Math.min(1.0, Math.max(0.01, parseFloat(jpegQualityInput.value) || 0.05));

        // Update displayed slider values
        currentWidthValue.textContent = userTargetWidth;
        currentHeightValue.textContent = userTargetHeight;
        currentQualityValue.textContent = userJpegQuality.toFixed(2); // Format to 2 decimal places

        const img = new Image();
        img.onload = () => {
            // Calculate aspect ratio to maintain it
            const aspectRatio = img.width / img.height;
            let newWidth = userTargetWidth;
            let newHeight = userTargetHeight;

            if (img.width > img.height) {
                newHeight = Math.round(userTargetWidth / aspectRatio);
            } else {
                newWidth = Math.round(userTargetHeight * aspectRatio);
            }

            // Ensure minimum dimensions if calculated size becomes too small (e.g., 0)
            if (newWidth === 0) newWidth = 1;
            if (newHeight === 0) newHeight = 1;

            // Set canvas dimensions to the new low resolution
            imageCanvas.width = newWidth;
            imageCanvas.height = newHeight;

            // Draw the original image onto the canvas, scaling it down
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Get the data URI from the canvas
            const dataUri = imageCanvas.toDataURL('image/jpeg', userJpegQuality);

            // Set explicit width and height on the preview image to prevent layout shifts
            outputImagePreview.width = newWidth;
            outputImagePreview.height = newHeight;
            outputImagePreview.src = dataUri;
            outputImagePreview.style.backgroundColor = ''; // Clear loading background

            dataUriOutput.textContent = dataUri;

            // Store Blob for download
            imageCanvas.toBlob((blob) => {
                currentBlob = blob;
                downloadButton.classList.remove('hidden'); // Show download button
            }, 'image/jpeg', userJpegQuality);

        };
        img.onerror = () => {
            console.error('Failed to load image for processing.');
            dataUriOutput.textContent = 'Error: Failed to load image.';
            outputImagePreview.src = '';
            outputImagePreview.style.backgroundColor = ''; // Clear loading background
            downloadButton.classList.add('hidden'); // Hide download button on error
            outputSection.classList.remove('hidden');
        };
        img.src = uploadedImage; // Use the stored uploaded image data
    }

    // Event listener for file input (initial upload)
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            uploadedImage = null;
            outputSection.classList.add('hidden');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage = e.target.result; // Store the image data
            processImage(); // Process the newly uploaded image
        };
        reader.onerror = () => {
            console.error('Failed to read file.');
            dataUriOutput.textContent = 'Error: Failed to read file.';
            outputSection.classList.remove('hidden');
        };
        reader.readAsDataURL(file); // Read file as Data URL
    });

    // Event listeners for slider changes (re-process image if one is uploaded)
    targetWidthInput.addEventListener('input', processImage);
    targetHeightInput.addEventListener('input', processImage);
    jpegQualityInput.addEventListener('input', processImage);


    copyButton.addEventListener('click', () => {
        const textToCopy = dataUriOutput.textContent;
        if (textToCopy && textToCopy !== 'Processing image...' && !textToCopy.startsWith('Error:')) {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                // Visual feedback for copy button
                const originalText = copyButton.textContent;
                const originalBg = copyButton.style.backgroundColor;
                copyButton.textContent = 'Copied!';
                copyButton.style.backgroundColor = '#10b981'; // Green color

                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.backgroundColor = originalBg; // Revert to original background
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            document.body.removeChild(textarea);
        }
    });

    // Event listener for download button
    downloadButton.addEventListener('click', () => {
        if (currentBlob) {
            const url = URL.createObjectURL(currentBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `low-res-image-${targetWidthInput.value}x${targetHeightInput.value}.jpeg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up the object URL
        }
    });
});
