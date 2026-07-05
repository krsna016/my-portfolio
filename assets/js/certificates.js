document.addEventListener('DOMContentLoaded', () => {
    const certificatesGrid = document.getElementById('certificates-grid');
    const certificatesPath = 'assets/docs/Certificates/';

    // Use global variable from certificates_data.js
    if (typeof certificatesData !== 'undefined') {
        certificatesGrid.innerHTML = '';
        certificatesData.forEach((cert, index) => {
            createCertificateCard(cert, index);
        });
    } else {
        console.error('certificatesData is not defined');
        certificatesGrid.innerHTML = '<div class="loader">Error loading certificates data.</div>';
    }

    // Modal Elements
    const modal = document.getElementById('pdf-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDownload = document.getElementById('modal-download-btn');
    const pdfCanvas = document.getElementById('pdf-canvas');
    const closeModal = document.querySelector('.close-modal');

    let currentRenderTask = null;

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            if (currentRenderTask) {
                currentRenderTask.cancel();
            }
            const ctx = pdfCanvas.getContext('2d');
            ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
        }, 300);
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                if (currentRenderTask) {
                    currentRenderTask.cancel();
                }
                const ctx = pdfCanvas.getContext('2d');
                ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
            }, 300);
        }
    });

    function createCertificateCard(cert, index) {
        const card = document.createElement('div');
        card.className = `certificate-card glass fade-in-up`;
        card.style.animationDelay = `${index * 0.1}s`;

        const iconContainer = document.createElement('div');
        iconContainer.className = 'cert-icon-container';

        const icon = document.createElement('i');
        icon.className = cert.icon;
        if (cert.color) {
            icon.style.setProperty('--cert-color', cert.color);
            icon.style.color = 'var(--cert-color)';
            // Shadow handled in CSS
        }

        iconContainer.appendChild(icon);

        const info = document.createElement('div');
        info.className = 'cert-info';

        const title = document.createElement('h3');
        title.textContent = cert.title;

        const desc = document.createElement('p');
        desc.textContent = cert.desc;

        const link = document.createElement('a');
        link.href = '#';
        link.className = 'cert-link';
        link.innerHTML = 'View Certificate <i class="fa-solid fa-eye"></i>';

        // Open Modal on Click
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            modalTitle.textContent = cert.title;

            const fileUrl = certificatesPath + cert.file;
            modalDownload.href = fileUrl;
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            try {
                if (typeof pdfjsLib !== 'undefined') {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                }
                
                const loadingTask = pdfjsLib.getDocument(fileUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1); // Certificates are usually 1 page
                
                const scale = 2.5; // High resolution
                const viewport = page.getViewport({ scale: scale });
                
                pdfCanvas.width = viewport.width;
                pdfCanvas.height = viewport.height;
                
                const renderContext = {
                    canvasContext: pdfCanvas.getContext('2d'),
                    viewport: viewport
                };
                
                currentRenderTask = page.render(renderContext);
                await currentRenderTask.promise;
            } catch (err) {
                if (err.name !== 'RenderingCancelledException') {
                    console.error('Error rendering PDF:', err);
                }
            }
        });

        info.appendChild(title);
        info.appendChild(desc);
        info.appendChild(link);

        card.appendChild(iconContainer);
        card.appendChild(info);
        certificatesGrid.appendChild(card);
    }
});
