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
        link.addEventListener('click', (e) => {
            e.preventDefault();
            modalTitle.textContent = cert.title;

            pdfFrame.src = certificatesPath + cert.file;

            modal.style.display = 'flex';
            // Small delay to allow display:flex to apply before adding opacity class
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });

        info.appendChild(title);
        info.appendChild(desc);
        info.appendChild(link);

        card.appendChild(iconContainer);
        card.appendChild(info);
        certificatesGrid.appendChild(card);
    }
});
