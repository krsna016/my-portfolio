const container = document.getElementById('ambient-container');
const scale = 3; // Increased for HD quality

// Global state
let isPenEnabled = false;
let currentTool = 'pen'; // 'pen' or 'highlighter'
let currentColor = '#ff0000';
let currentLineWidth = 5;

async function renderResume() {
    // Ensure worker is set correctly
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    if (!resumeBase64) {
        console.error('Resume data not found');
        return;
    }

    const skeleton = document.getElementById('resume-skeleton');

    try {
        // Show skeleton
        if (skeleton) skeleton.classList.add('visible');

        const loadingTask = pdfjsLib.getDocument(resumeBase64);
        const pdf = await loadingTask.promise;

        // Loop through all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: scale });

            // Create wrapper for this page
            const pageWrapper = document.createElement('div');
            pageWrapper.className = 'pdf-page-wrapper';
            if (isPenEnabled) {
                pageWrapper.classList.add('drawing-active');
            }

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

            // 3. Drawing Layer (Top)
            const drawingCanvas = document.createElement('canvas');
            drawingCanvas.className = 'drawing-layer';
            const drawingContext = drawingCanvas.getContext('2d');
            drawingCanvas.height = viewport.height;
            drawingCanvas.width = viewport.width;

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
            pageWrapper.appendChild(drawingCanvas);
            container.appendChild(pageWrapper);

            // Drawing Logic
            let isDrawing = false;
            let lastX = 0;
            let lastY = 0;
            let startX = 0;
            let startY = 0;
            let lockedAxis = null; // 'x' or 'y'

            function startDrawing(e) {
                console.log('Start drawing');
                isDrawing = true;
                lockedAxis = null; // Reset lock
                [lastX, lastY] = getCoordinates(e, drawingCanvas);
                startX = lastX;
                startY = lastY;
            }

            function draw(e) {
                if (!isDrawing) return;
                let [x, y] = getCoordinates(e, drawingCanvas);

                // Axis Locking for Highlighter
                if (currentTool === 'highlighter') {
                    const dx = Math.abs(x - startX);
                    const dy = Math.abs(y - startY);
                    const threshold = 10 * scale; // Movement threshold to determine axis

                    if (!lockedAxis && (dx > threshold || dy > threshold)) {
                        if (dx > dy) {
                            lockedAxis = 'y'; // Lock Y axis (horizontal line)
                        } else {
                            lockedAxis = 'x'; // Lock X axis (vertical line)
                        }
                    }

                    if (lockedAxis === 'y') {
                        y = startY; // Keep Y constant
                    } else if (lockedAxis === 'x') {
                        x = startX; // Keep X constant
                    }
                }

                drawingContext.beginPath();
                drawingContext.moveTo(lastX, lastY);
                drawingContext.lineTo(x, y);

                // Apply styles based on current tool
                drawingContext.strokeStyle = currentColor;
                drawingContext.lineWidth = currentLineWidth * scale;
                drawingContext.lineCap = 'round';
                drawingContext.lineJoin = 'round';

                if (currentTool === 'highlighter') {
                    drawingContext.globalAlpha = 0.5; // Translucent for highlighter
                    drawingContext.lineWidth = (currentLineWidth * 4) * scale; // Thicker for highlighter
                    drawingContext.lineCap = 'butt'; // Flat end for highlighter look
                    drawingContext.lineJoin = 'round'; // Round join to prevent miter spikes
                } else {
                    drawingContext.globalAlpha = 1.0; // Opaque for pen
                    drawingContext.lineCap = 'round';
                    drawingContext.lineJoin = 'round';
                }

                drawingContext.stroke();

                // Reset alpha for other operations if needed
                drawingContext.globalAlpha = 1.0;

                [lastX, lastY] = [x, y];
            }

            function stopDrawing() {
                isDrawing = false;
            }

            function getCoordinates(e, canvas) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;

                let clientX, clientY;
                if (e.type.startsWith('touch')) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                return [
                    (clientX - rect.left) * scaleX,
                    (clientY - rect.top) * scaleY
                ];
            }

            // Event Listeners
            drawingCanvas.addEventListener('mousedown', startDrawing);
            drawingCanvas.addEventListener('mousemove', draw);
            drawingCanvas.addEventListener('mouseup', stopDrawing);
            drawingCanvas.addEventListener('mouseout', stopDrawing);

            drawingCanvas.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent scrolling
                startDrawing(e);
            }, { passive: false });
            drawingCanvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                draw(e);
            }, { passive: false });
            drawingCanvas.addEventListener('touchend', stopDrawing);
            // Append to container
            container.appendChild(pageWrapper);
        }

        // Hide skeleton when done
        if (skeleton) {
            skeleton.classList.add('fade-out');
            setTimeout(() => {
                skeleton.classList.remove('visible', 'fade-out');
            }, 500); // Match CSS transition
        }

    } catch (error) {
        console.error('Error rendering resume:', error);
        if (skeleton) skeleton.classList.remove('visible');
    }
}

// UI Controls Logic (Initialized separately)
function initDrawingControls() {
    console.log('Initializing drawing controls...');
    const togglePenBtn = document.getElementById('toggle-pen');
    const toggleHighlighterBtn = document.getElementById('toggle-highlighter');
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const colorPicker = document.getElementById('color-picker');
    const lineWidthSlider = document.getElementById('line-width');
    const clearBtn = document.getElementById('clear-drawing');

    let isResumeDarkMode = true;
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            isResumeDarkMode = !isResumeDarkMode;
            const ambientCont = document.getElementById('ambient-container');
            if (ambientCont) {
                ambientCont.classList.toggle('resume-dark-mode', isResumeDarkMode);
            }
            if (isResumeDarkMode) {
                toggleThemeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
                toggleThemeBtn.classList.add('active-tool');
            } else {
                toggleThemeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
                toggleThemeBtn.classList.remove('active-tool');
            }
        });
    }

    function updateToolUI() {
        if (togglePenBtn) togglePenBtn.classList.toggle('active-tool', isPenEnabled && currentTool === 'pen');
        if (toggleHighlighterBtn) toggleHighlighterBtn.classList.toggle('active-tool', isPenEnabled && currentTool === 'highlighter');

        // Update cursor based on tool
        document.querySelectorAll('.drawing-layer').forEach(canvas => {
            canvas.style.cursor = isPenEnabled ? 'crosshair' : 'default';
        });
    }

    function toggleDrawingMode(enable) {
        isPenEnabled = enable;
        document.querySelectorAll('.pdf-page-wrapper').forEach(wrapper => {
            wrapper.classList.toggle('drawing-active', isPenEnabled);
        });
        updateToolUI();
    }

    if (togglePenBtn) {
        togglePenBtn.addEventListener('click', () => {
            if (currentTool === 'pen' && isPenEnabled) {
                // Disable if clicking active tool
                toggleDrawingMode(false);
            } else {
                currentTool = 'pen';
                toggleDrawingMode(true);
            }
        });
    }

    if (toggleHighlighterBtn) {
        toggleHighlighterBtn.addEventListener('click', () => {
            if (currentTool === 'highlighter' && isPenEnabled) {
                // Disable if clicking active tool
                toggleDrawingMode(false);
            } else {
                currentTool = 'highlighter';
                toggleDrawingMode(true);
            }
        });
    }

    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            currentColor = e.target.value;
        });
    }

    if (lineWidthSlider) {
        lineWidthSlider.addEventListener('input', (e) => {
            currentLineWidth = parseInt(e.target.value);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.querySelectorAll('.drawing-layer').forEach(canvas => {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderResume();
    initDrawingControls();
});
