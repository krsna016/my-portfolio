document.addEventListener('DOMContentLoaded', () => {
    const certForm = document.getElementById('cert-form');
    const certList = document.getElementById('cert-list');
    const iconGrid = document.getElementById('icon-grid');
    const iconSearch = document.getElementById('icon-search');
    const selectedIconInput = document.getElementById('selected-icon');
    const editIndexInput = document.getElementById('edit-index');
    const saveJsonBtn = document.getElementById('save-json-btn');
    const loadJsonBtn = document.getElementById('load-json-btn');
    const clearFormBtn = document.getElementById('clear-form');

    let certificates = [];

    // Curated FontAwesome Icons
    const icons = [
        'fa-solid fa-certificate', 'fa-solid fa-graduation-cap', 'fa-solid fa-award', 'fa-solid fa-medal',
        'fa-solid fa-briefcase', 'fa-solid fa-laptop-code', 'fa-solid fa-code', 'fa-solid fa-terminal',
        'fa-solid fa-database', 'fa-solid fa-server', 'fa-solid fa-cloud', 'fa-solid fa-network-wired',
        'fa-solid fa-robot', 'fa-solid fa-brain', 'fa-solid fa-microchip', 'fa-solid fa-chart-line',
        'fa-solid fa-chart-pie', 'fa-solid fa-chart-bar', 'fa-solid fa-file-code', 'fa-solid fa-folder-open',
        'fa-solid fa-shield-halved', 'fa-solid fa-lock', 'fa-solid fa-key', 'fa-solid fa-bug',
        'fa-solid fa-puzzle-piece', 'fa-solid fa-layer-group', 'fa-solid fa-cube', 'fa-solid fa-cubes',
        'fa-solid fa-rocket', 'fa-solid fa-plane-departure', 'fa-solid fa-globe', 'fa-solid fa-earth-americas',
        'fa-brands fa-python', 'fa-brands fa-java', 'fa-brands fa-js', 'fa-brands fa-react',
        'fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-node', 'fa-brands fa-docker',
        'fa-brands fa-aws', 'fa-brands fa-google', 'fa-brands fa-microsoft', 'fa-brands fa-apple',
        'fa-brands fa-linux', 'fa-brands fa-github', 'fa-brands fa-gitlab', 'fa-brands fa-bitbucket',
        'fa-brands fa-stack-overflow', 'fa-brands fa-dev', 'fa-brands fa-space-awesome'
    ];

    // Initialize
    renderIcons();
    loadCertificates();

    // Render Icons
    function renderIcons(filter = '') {
        iconGrid.innerHTML = '';
        icons.forEach(iconClass => {
            if (iconClass.toLowerCase().includes(filter.toLowerCase())) {
                const div = document.createElement('div');
                div.className = 'icon-option';
                if (selectedIconInput.value === iconClass) div.classList.add('selected');
                div.innerHTML = `<i class="${iconClass}"></i>`;
                div.onclick = () => selectIcon(iconClass);
                iconGrid.appendChild(div);
            }
        });
    }

    function selectIcon(iconClass) {
        selectedIconInput.value = iconClass;
        renderIcons(iconSearch.value); // Re-render to update selection state
    }

    iconSearch.addEventListener('input', (e) => {
        renderIcons(e.target.value);
    });

    // Load Certificates
    function loadCertificates() {
        if (typeof certificatesData !== 'undefined') {
            certificates = [...certificatesData]; // Create a copy
            renderCertList();
        } else {
            console.error('certificatesData is not defined');
            alert('Could not load certificates data. Starting with empty list.');
            certificates = [];
            renderCertList();
        }
    }

    // Render List
    function renderCertList() {
        certList.innerHTML = '';
        certificates.forEach((cert, index) => {
            const item = document.createElement('div');
            item.className = 'cert-item';
            item.innerHTML = `
                <div class="cert-item-info">
                    <i class="${cert.icon}" style="color: ${cert.color || '#fff'}; font-size: 1.5rem;"></i>
                    <div>
                        <div style="font-weight: 600;">${cert.title}</div>
                        <div style="font-size: 0.8rem; color: #aaa;">${cert.file}</div>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="btn-icon btn-up" onclick="moveCert(${index}, -1)" ${index === 0 ? 'disabled' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="btn-icon btn-down" onclick="moveCert(${index}, 1)" ${index === certificates.length - 1 ? 'disabled' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="btn-icon btn-edit" onclick="editCert(${index})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteCert(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            certList.appendChild(item);
        });
    }

    // Form Submit
    certForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newCert = {
            title: document.getElementById('cert-title').value,
            file: document.getElementById('cert-file').value,
            color: document.getElementById('cert-color').value,
            icon: document.getElementById('selected-icon').value
        };

        if (!newCert.icon) {
            alert('Please select an icon.');
            return;
        }

        const index = parseInt(editIndexInput.value);
        if (index >= 0) {
            certificates[index] = newCert;
        } else {
            certificates.push(newCert);
        }

        renderCertList();
        resetForm();
    });

    // Actions
    window.editCert = (index) => {
        const cert = certificates[index];
        document.getElementById('cert-title').value = cert.title;
        document.getElementById('cert-file').value = cert.file;
        document.getElementById('cert-color').value = cert.color || '#6c63ff';
        selectIcon(cert.icon);
        editIndexInput.value = index;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteCert = (index) => {
        if (confirm('Are you sure you want to delete this certificate?')) {
            certificates.splice(index, 1);
            renderCertList();
        }
    };

    window.moveCert = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < certificates.length) {
            [certificates[index], certificates[newIndex]] = [certificates[newIndex], certificates[index]];
            renderCertList();
        }
    };

    // Reset
    function resetForm() {
        certForm.reset();
        editIndexInput.value = '-1';
        selectedIconInput.value = '';
        renderIcons();
    }

    clearFormBtn.addEventListener('click', resetForm);
    loadJsonBtn.addEventListener('click', () => {
        if (confirm('Reloading will lose unsaved changes. Continue?')) {
            location.reload();
        }
    });

    // Save / Download
    saveJsonBtn.addEventListener('click', () => {
        const jsonStr = JSON.stringify(certificates, null, 4);
        const jsContent = `const certificatesData = ${jsonStr};`;
        const dataUri = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(jsContent);

        const exportFileDefaultName = 'certificates_data.js';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        alert('Configuration downloaded! Please replace the "certificates_data.js" file in your project folder with this new file.');
    });
});
