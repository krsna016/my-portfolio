const container = document.getElementById('ambient-container');
const scale = 3; // Increased for HD quality

async function renderResume() {
    if (!resumeBase64) {
        console.error('Resume data not found');
        return;
    }

    try {
        const loadingTask = pdfjsLib.getDocument(resumeBase64);
        const pdf = await loadingTask.promise;

        // Loop through all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: scale });

            // Create wrapper for this page
            const pageWrapper = document.createElement('div');
            pageWrapper.className = 'pdf-page-wrapper';

            // 1. Ambient Layer (Background)
            const ambientCanvas = document.createElement('canvas');
            ambientCanvas.className = 'ambient-layer';
            const ambientContext = ambientCanvas.getContext('2d');
            ambientCanvas.height = viewport.height;
            ambientCanvas.width = viewport.width;

            // 2. Content Layer (Foreground)
            const contentCanvas = document.createElement('canvas');
            contentCanvas.className = 'content-layer';
            const contentContext = contentCanvas.getContext('2d');
            contentCanvas.height = viewport.height;
            contentCanvas.width = viewport.width;

            // Render to content canvas
            const renderContext = {
                canvasContext: contentContext,
                viewport: viewport
            };
            await page.render(renderContext).promise;

            // Draw content to ambient canvas (it will be blurred by CSS)
            ambientContext.drawImage(contentCanvas, 0, 0);

            // Assemble
            pageWrapper.appendChild(ambientCanvas);
            pageWrapper.appendChild(contentCanvas);
            container.appendChild(pageWrapper);
        }

    } catch (error) {
        console.error('Error rendering resume:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', renderResume);
