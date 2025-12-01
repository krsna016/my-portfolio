document.addEventListener('DOMContentLoaded', () => {
    const certificatesGrid = document.getElementById('certificates-grid');
    const certificatesPath = 'Certificates/';

    const certificates = [
        {
            file: 'InternshipCertificate.pdf',
            title: 'Internship Certificate'
        },
        {
            file: 'The_Ultimate_Job_Ready_Data_Science_Course_Certificate.pdf',
            title: 'Data Science Course'
        },
        {
            file: 'introduction_to_data_sciecne_certificate.pdf',
            title: 'Intro to Data Science'
        },
        {
            file: 'postma_api_fundamentals_student_expert_badge.pdf',
            title: 'Postman API Badge'
        },
        {
            file: 'postma_api_fundamentals_student_expert_certificate.pdf',
            title: 'Postman API Expert'
        },
        {
            file: 'problem_solving_basic certificate.pdf',
            title: 'Problem Solving (Basic)'
        },
        {
            file: 'python_basic certificate.pdf',
            title: 'Python (Basic)'
        },
        {
            file: 'tcs_britishairways_virtual_internship_certificate.pdf',
            title: 'TCS British Airways Internship'
        },
        {
            file: 'tcs_cybersecurity_virtual_internship_certificate.pdf',
            title: 'TCS Cybersecurity Internship'
        },
        {
            file: 'upskill-campus-internship-completion-certificate.pdf',
            title: 'Upskill Campus Internship'
        }
    ];

    // Clear loader
    certificatesGrid.innerHTML = '';

    certificates.forEach((cert, index) => {
        createCertificateCard(cert, index);
    });

    // Modal Elements
    const modal = document.getElementById('pdf-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDownload = document.getElementById('modal-download');
    const pdfFrame = document.getElementById('pdf-frame');
    const closeModal = document.querySelector('.close-modal');

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            pdfFrame.src = ''; // Clear source to stop playing/loading
        }, 300);
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                pdfFrame.src = '';
            }, 300);
        }
    });

    async function createCertificateCard(cert, index) {
        const card = document.createElement('div');
        card.className = `certificate-card glass fade-in-up`;
        card.style.animationDelay = `${index * 0.1}s`;

        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'cert-canvas-container';

        const canvas = document.createElement('canvas');
        canvasContainer.appendChild(canvas);

        const info = document.createElement('div');
        info.className = 'cert-info';

        const title = document.createElement('h3');
        title.textContent = cert.title;

        const link = document.createElement('a');
        link.href = '#';
        link.className = 'cert-link';
        link.innerHTML = 'View Certificate <i class="fa-solid fa-eye"></i>';

        // Open Modal on Click
        link.addEventListener('click', (e) => {
            e.preventDefault();
            modalTitle.textContent = cert.title;
            modalDownload.href = certificatesPath + cert.file;
            pdfFrame.src = certificatesPath + cert.file;

            modal.style.display = 'flex';
            // Small delay to allow display:flex to apply before adding opacity class
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });

        info.appendChild(title);
        info.appendChild(link);

        card.appendChild(canvasContainer);
        card.appendChild(info);
        certificatesGrid.appendChild(card);

        // Render PDF Thumbnail
        try {
            const loadingTask = pdfjsLib.getDocument(certificatesPath + cert.file);
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);

            const viewport = page.getViewport({ scale: 0.5 }); // Scale down for thumbnail
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
        } catch (error) {
            console.error('Error rendering PDF:', error);
            canvasContainer.innerHTML = '<div class="pdf-error"><i class="fa-solid fa-file-pdf"></i><br>PDF Preview Unavailable</div>';
        }
    }
});
