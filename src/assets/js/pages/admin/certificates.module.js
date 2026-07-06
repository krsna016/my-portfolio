import { escapeHTML, saveConfigToServer } from './main.js';

export function initCertificates() {
        // --- Certificate Management Logic ---
    
        // Global state for certificates (loaded from certificates_data.js)
        let currentCertificates = typeof certificatesData !== 'undefined' ? [...certificatesData] : [];
    
        const certList = document.getElementById('cert-list');
        const certForm = document.getElementById('cert-form');
        const editIndexInput = document.getElementById('edit-index');
        const clearFormBtn = document.getElementById('clear-form');
    
        // Icon Selection Logic
        const iconGrid = document.getElementById('icon-grid');
        const iconSearch = document.getElementById('icon-search');
        const selectedIconInput = document.getElementById('selected-icon');
    
        // Common FontAwesome Icons for Certs
        const commonIcons = [
            'fa-solid fa-certificate', 'fa-solid fa-graduation-cap', 'fa-solid fa-award',
            'fa-solid fa-medal', 'fa-solid fa-trophy', 'fa-solid fa-scroll',
            'fa-solid fa-file-pdf', 'fa-solid fa-code', 'fa-solid fa-laptop-code',
            'fa-brands fa-python', 'fa-brands fa-js', 'fa-brands fa-java',
            'fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-react',
            'fa-brands fa-node', 'fa-brands fa-angular', 'fa-brands fa-vuejs',
            'fa-brands fa-aws', 'fa-brands fa-docker', 'fa-brands fa-git-alt',
            'fa-brands fa-github', 'fa-brands fa-linux', 'fa-solid fa-database',
            'fa-solid fa-server', 'fa-solid fa-cloud', 'fa-solid fa-shield-halved',
            'fa-solid fa-robot', 'fa-solid fa-brain', 'fa-solid fa-chart-line',
            'fa-solid fa-briefcase', 'fa-solid fa-user-graduate'
        ];
    
        // Render Icons
        function renderIcons(filter = '') {
            iconGrid.innerHTML = '';
            commonIcons.forEach(iconClass => {
                if (iconClass.includes(filter.toLowerCase())) {
                    const iconDiv = document.createElement('div');
                    iconDiv.className = `icon-option ${selectedIconInput.value === iconClass ? 'selected' : ''}`;
                    iconDiv.innerHTML = `<i class="${iconClass}"></i>`;
                    iconDiv.onclick = () => selectIcon(iconClass, iconDiv);
                    iconGrid.appendChild(iconDiv);
                }
            });
        }
    
        function selectIcon(iconClass, element) {
            selectedIconInput.value = iconClass;
            document.querySelectorAll('.icon-option').forEach(el => el.classList.remove('selected'));
            element.classList.add('selected');
        }
    
        if (iconSearch) {
            iconSearch.addEventListener('input', (e) => renderIcons(e.target.value));
        }
    
        // Initial Render
        renderIcons();
    
    
        // Render Certificate List
        function renderCertList() {
            certList.innerHTML = '';
            currentCertificates.forEach((cert, index) => {
                const item = document.createElement('div');
                item.className = 'cert-item glass';
                item.innerHTML = `
                    <div class="cert-item-info">
                        <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 50%;">
                            <i class="${cert.icon}" style="color: ${cert.color || '#fff'}"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0;">${escapeHTML(cert.title)}</h4>
                            <small style="color: #888;">${escapeHTML(cert.file)}</small>
                        </div>
                    </div>
                    <div class="cert-item-actions">
                        <button class="admin-action-btn" onclick="moveCert(${index}, -1)" title="Move Up"><i class="fa-solid fa-arrow-up"></i></button>
                        <button class="admin-action-btn" onclick="moveCert(${index}, 1)" title="Move Down"><i class="fa-solid fa-arrow-down"></i></button>
                        <button class="admin-action-btn" style="color: #00d4ff;" onclick="editCert(${index})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="admin-action-btn" style="color: #ff6b6b;" onclick="deleteCert(${index})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                certList.appendChild(item);
            });
        }
    
        // Form Submit (Add/Update)
        if (certForm) {
            certForm.addEventListener('submit', (e) => {
                e.preventDefault();
    
                const title = document.getElementById('cert-title').value;
                const file = document.getElementById('cert-file').value;
                const color = document.getElementById('cert-color').value;
                const icon = document.getElementById('selected-icon').value;
                const index = parseInt(editIndexInput.value);
    
                if (!icon) {
                    alert('Please select an icon');
                    return;
                }
    
                const newCert = { file, title, icon, color };
    
                if (index >= 0) {
                    // Update
                    currentCertificates[index] = newCert;
                } else {
                    // Add
                    currentCertificates.push(newCert);
                }
    
                renderCertList();
                saveConfigToServer('certificates', currentCertificates);
                resetForm();
            });
        }
    
        function resetForm() {
            certForm.reset();
            editIndexInput.value = '-1';
            document.getElementById('cert-color').value = '#6c63ff';
            selectedIconInput.value = '';
            renderIcons(); // Clear selection visual
            document.querySelector('#tab-certificates .editor-panel h3').textContent = 'Add / Edit Certificate';
        }
    
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', resetForm);
        }
    
        // Expose functions to global scope for onclick handlers
        window.editCert = function (index) {
            const cert = currentCertificates[index];
            document.getElementById('cert-title').value = cert.title;
            document.getElementById('cert-file').value = cert.file;
            document.getElementById('cert-color').value = cert.color || '#6c63ff';
            document.getElementById('selected-icon').value = cert.icon;
            editIndexInput.value = index;
    
            // Update icon selection visual
            renderIcons();
            // Manually highlight the selected icon if it's in the current view
            const iconDivs = document.querySelectorAll('.icon-option');
            iconDivs.forEach(div => {
                if (div.innerHTML.includes(cert.icon)) {
                    div.classList.add('selected');
                }
            });
    
            document.querySelector('#tab-certificates .editor-panel h3').textContent = 'Edit Certificate';
    
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    
        window.deleteCert = function (index) {
            if (confirm('Are you sure you want to delete this certificate?')) {
                currentCertificates.splice(index, 1);
                renderCertList();
                saveConfigToServer('certificates', currentCertificates);
            }
        };
    
        window.moveCert = function (index, direction) {
            const newIndex = index + direction;
            if (newIndex >= 0 && newIndex < currentCertificates.length) {
                [currentCertificates[index], currentCertificates[newIndex]] = [currentCertificates[newIndex], currentCertificates[index]];
                renderCertList();
                saveConfigToServer('certificates', currentCertificates);
            }
        };
    
    
}
