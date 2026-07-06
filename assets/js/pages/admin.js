function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const adminContainer = document.querySelector('.admin-container');
    const navbar = document.querySelector('.navbar');

    // Parse cookies helper
    function parseCookies(cookieHeader) {
        const list = {};
        if (!cookieHeader) return list;
        cookieHeader.split(';').forEach(cookie => {
            let parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;
    }

    // Sync token state on boot
    let token = localStorage.getItem('adminToken');
    const cookieToken = parseCookies(document.cookie)['adminToken'];

    if (cookieToken && !token) {
        localStorage.setItem('adminToken', cookieToken);
        localStorage.setItem('adminLoggedIn', 'true');
        token = cookieToken;
    } else if (token && !cookieToken) {
        document.cookie = "adminToken=" + token + "; Path=/; Max-Age=86400; SameSite=Strict";
        window.location.reload();
        return;
    }

    async function checkAuthentication() {
        // Scenario A: We are on the private Admin Panel page
        if (adminContainer) {
            if (!token) {
                window.location.href = 'admin.html';
                return;
            }
            try {
                const res = await fetch('/api/check-auth', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) {
                    localStorage.removeItem('adminLoggedIn');
                    localStorage.removeItem('adminToken');
                    document.cookie = "adminToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
                    window.location.href = 'admin.html';
                }
            } catch (e) {
                if (localStorage.getItem('adminLoggedIn') !== 'true') {
                    window.location.href = 'admin.html';
                }
            }
        }
        
        // Scenario B: We are on the Login page
        if (loginOverlay && token) {
            try {
                const res = await fetch('/api/check-auth', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    window.location.href = 'admin.html';
                    return;
                } else {
                    localStorage.removeItem('adminLoggedIn');
                    localStorage.removeItem('adminToken');
                    document.cookie = "adminToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
                }
            } catch (e) {
                if (localStorage.getItem('adminLoggedIn') === 'true') {
                    window.location.href = 'admin.html';
                    return;
                }
            }
        }
    }

    // Run verification immediately
    checkAuthentication();

    const biometricBtn = document.getElementById('biometric-btn');

    // --- Settings Auto-Sync Logic ---
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        document.getElementById('gh-repo').value = localStorage.getItem('ghRepo') || '';
        document.getElementById('gh-branch').value = localStorage.getItem('ghBranch') || 'master';
        document.getElementById('gh-token').value = localStorage.getItem('ghToken') || '';

        // Verify if GitHub Auto-Sync is active and populate from server if active
        fetch('/api/sync-status')
            .then(res => res.json())
            .then(status => {
                if (status.githubSyncActive) {
                    if (!localStorage.getItem('ghRepo') && status.repo) {
                        localStorage.setItem('ghRepo', status.repo);
                        document.getElementById('gh-repo').value = status.repo;
                    }
                    if (!localStorage.getItem('ghBranch') && status.branch) {
                        localStorage.setItem('ghBranch', status.branch);
                        document.getElementById('gh-branch').value = status.branch;
                    }
                    if (!localStorage.getItem('ghToken')) {
                        localStorage.setItem('ghToken', '***SERVER_CONFIGURED***');
                        document.getElementById('gh-token').value = '***SERVER_CONFIGURED***';
                    }
                    const warningBox = document.getElementById('sync-warning-box');
                    if (warningBox) warningBox.style.display = 'none';
                } else {
                    const hasLocalToken = !!localStorage.getItem('ghToken');
                    if (!hasLocalToken) {
                        const warningBox = document.getElementById('sync-warning-box');
                        if (warningBox) warningBox.style.display = 'block';
                    }
                }
            })
            .catch(() => {});

        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let repoVal = document.getElementById('gh-repo').value.trim();
            // Sanitize in case they pasted the full URL
            repoVal = repoVal.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
            document.getElementById('gh-repo').value = repoVal;

            const branchVal = document.getElementById('gh-branch').value.trim();
            const tokenVal = document.getElementById('gh-token').value.trim();

            localStorage.setItem('ghRepo', repoVal);
            localStorage.setItem('ghBranch', branchVal);
            localStorage.setItem('ghToken', tokenVal);

            // Save to server permanently
            const adminToken = localStorage.getItem('adminToken');
            if (adminToken) {
                try {
                    await fetch('/api/save-github-settings', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${adminToken}`
                        },
                        body: JSON.stringify({ repo: repoVal, branch: branchVal, token: tokenVal })
                    });
                } catch (err) {
                    console.error("Error backing up settings to server:", err);
                }
            }

            const successMsg = document.getElementById('settings-success');
            successMsg.style.display = 'block';
            setTimeout(() => successMsg.style.display = 'none', 3000);
        });
    }

    window.pushToGitHub = async function(filePath, contentStr, commitMessage) {
        const token = localStorage.getItem('ghToken');
        const repo = localStorage.getItem('ghRepo');
        const branch = localStorage.getItem('ghBranch') || 'master';
        if (!token || !repo) return false;

        try {
            const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
            let sha = null;
            const getRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' } });
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }
            const body = { message: commitMessage, branch };
            if (sha) body.sha = sha;
            body.content = btoa(unescape(encodeURIComponent(contentStr)));

            const commitRes = await fetch(url, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!commitRes.ok) {
                const errData = await commitRes.json().catch(() => ({}));
                console.error("GitHub API Error:", errData);
                return { ok: false, error: errData.message || 'Unknown Error' };
            }
            return { ok: true };
        } catch (e) {
            console.error(e);
            return { ok: false, error: e.message };
        }
    };

    window.deleteFromGitHub = async function(filePath) {
        const token = localStorage.getItem('ghToken');
        const repo = localStorage.getItem('ghRepo');
        const branch = localStorage.getItem('ghBranch') || 'master';
        if (!token || !repo) return { ok: false, error: 'GitHub Integration not configured' };

        try {
            const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
            let sha = null;
            const getRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' } });
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }
            if (!sha) return { ok: true }; // File already doesn't exist

            const commitRes = await fetch(url, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: `docs: delete ${filePath}`, sha, branch })
            });
            if (!commitRes.ok) {
                const errData = await commitRes.json().catch(() => ({}));
                return { ok: false, error: errData.message || 'Unknown Error' };
            }
            return { ok: true };
        } catch (e) {
            return { ok: false, error: e.message };
        }
    };

    // Login Form Submit (Robust Fallback)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = passwordInput.value;
            loginError.style.display = 'none';

            try {
                // Try backend validation first to support custom secure passwords
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('adminLoggedIn', 'true');
                    localStorage.setItem('adminPasswordCache', password);
                    if (data && data.token) {
                        localStorage.setItem('adminToken', data.token);
                        document.cookie = "adminToken=" + data.token + "; Path=/; Max-Age=86400; SameSite=Strict";
                    }
                    loginOverlay.style.display = 'none';
                    passwordInput.value = '';
                    window.location.reload(); // Reload to sync status across all tabs
                    return;
                } else if (res.status === 401) {
                    throw new Error("Invalid password");
                } else {
                    throw new Error("Server error");
                }
            } catch (err) {
                if (err.message === "Invalid password") {
                    loginError.textContent = "Incorrect password.";
                    loginError.style.display = 'block';
                    passwordInput.classList.add('shake');
                    setTimeout(() => passwordInput.classList.remove('shake'), 500);
                } else {
                    // Network / connection error -> Fallback to client-side static mode password check
                    if (password === 'admin123') {
                        console.warn("Running in Static Preview Mode. Authenticated client-side.");
                        localStorage.setItem('adminLoggedIn', 'true');
                        loginOverlay.style.display = 'none';
                        passwordInput.value = '';
                        window.location.reload();
                    } else {
                        loginError.textContent = "Incorrect password (Static Preview Mode).";
                        loginError.style.display = 'block';
                        passwordInput.classList.add('shake');
                        setTimeout(() => passwordInput.classList.remove('shake'), 500);
                    }
                }
            }
        });
    }

    // Biometric WebAuthn Logic
    if (biometricBtn) {
        biometricBtn.addEventListener('click', async () => {
            if (!window.PublicKeyCredential) {
                alert("Biometrics not supported on this device/browser.");
                return;
            }

            const savedPassword = localStorage.getItem('adminPasswordCache');
            if (!savedPassword) {
                alert("Please log in with your password once first to register this device for biometric login.");
                return;
            }

            try {
                // Generate a dummy challenge to trigger native OS Biometric prompt
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);
                
                const credential = await navigator.credentials.create({
                    publicKey: {
                        challenge: challenge,
                        rp: { name: "Portfolio Admin", id: window.location.hostname },
                        user: {
                            id: new Uint8Array(16),
                            name: "admin",
                            displayName: "Administrator"
                        },
                        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
                        authenticatorSelection: { authenticatorAttachment: "platform" },
                        timeout: 60000,
                    }
                });

                if (credential) {
                    localStorage.setItem('adminLoggedIn', 'true');
                    try {
                        const res = await fetch('/api/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ password: savedPassword })
                        });
                        if (res.ok) {
                            const data = await res.json();
                            if (data && data.token) {
                                localStorage.setItem('adminToken', data.token);
                                document.cookie = "adminToken=" + data.token + "; Path=/; Max-Age=86400; SameSite=Strict";
                            }
                        }
                    } catch (err) {
                        console.log('No backend API found, biometric authentication running locally.', err);
                    }

                    loginOverlay.style.display = 'none';
                    loginError.style.display = 'none';
                    window.location.reload();
                }
            } catch (err) {
                console.error(err);
                loginError.textContent = "Biometric Authentication Failed or Cancelled.";
                loginError.style.display = 'block';
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminToken');
            document.cookie = "adminToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
            window.location.reload();
        });
    }

    // --- Unified Config Auto-Saver ---
    async function saveConfigToServer(type, data) {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            const res = await fetch('/api/save-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type, data })
            });
            if (res.ok) {
                console.log(`${type} auto-saved successfully`);
            } else {
                console.error(`Failed to auto-save ${type}`, await res.text());
                alert(`Failed to save ${type} changes to live server!`);
            }
        } catch (e) {
            console.error(`Connection error auto-saving ${type}`, e);
            alert(`Error connecting to live server while saving ${type}!`);
        }
    }

    // --- Tab Switching Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('primary');
                b.classList.add('secondary');
            });
            // Add active class to clicked button
            btn.classList.add('active');
            btn.classList.remove('secondary');
            btn.classList.add('primary');

            // Hide all contents
            tabContents.forEach(content => content.style.display = 'none');
            // Show target content
            document.getElementById(`tab-${btn.dataset.tab}`).style.display = 'grid';
        });
    });

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


    // --- Skills Management Logic ---

    let currentSkills = typeof skillsData !== 'undefined' ? [...skillsData] : [];
    const skillList = document.getElementById('skill-list');
    const skillForm = document.getElementById('skill-form');
    const skillEditIndexInput = document.getElementById('skill-edit-index');
    const clearSkillFormBtn = document.getElementById('clear-skill-form');

    function renderSkillList() {
        skillList.innerHTML = '';
        currentSkills.forEach((skill, index) => {
            const item = document.createElement('div');
            item.className = 'cert-item glass';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div>
                        <h4 style="margin: 0;">${escapeHTML(skill.name)}</h4>
                        <small style="color: #888;">${escapeHTML(skill.desc)}</small>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="admin-action-btn" onclick="moveSkill(${index}, -1)" title="Move Up"><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="admin-action-btn" onclick="moveSkill(${index}, 1)" title="Move Down"><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="admin-action-btn" style="color: #00d4ff;" onclick="editSkill(${index})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="admin-action-btn" style="color: #ff6b6b;" onclick="deleteSkill(${index})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            skillList.appendChild(item);
        });
    }

    if (skillForm) {
        skillForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('skill-name').value;
            const desc = document.getElementById('skill-desc').value;
            const index = parseInt(skillEditIndexInput.value);

            const newSkill = { name, desc };

            if (index >= 0) {
                currentSkills[index] = newSkill;
            } else {
                currentSkills.push(newSkill);
            }

            renderSkillList();
            saveConfigToServer('skills', currentSkills);
            resetSkillForm();
        });
    }

    function resetSkillForm() {
        skillForm.reset();
        skillEditIndexInput.value = '-1';
        document.querySelector('#tab-skills .editor-panel h3').textContent = 'Add / Edit Skill';
    }

    if (clearSkillFormBtn) {
        clearSkillFormBtn.addEventListener('click', resetSkillForm);
    }

    window.editSkill = function (index) {
        const skill = currentSkills[index];
        document.getElementById('skill-name').value = skill.name;
        document.getElementById('skill-desc').value = skill.desc;
        skillEditIndexInput.value = index;
        document.querySelector('#tab-skills .editor-panel h3').textContent = 'Edit Skill';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteSkill = function (index) {
        if (confirm('Are you sure you want to delete this skill?')) {
            currentSkills.splice(index, 1);
            renderSkillList();
            saveConfigToServer('skills', currentSkills);
        }
    };

    window.moveSkill = function (index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < currentSkills.length) {
            [currentSkills[index], currentSkills[newIndex]] = [currentSkills[newIndex], currentSkills[index]];
            renderSkillList();
            saveConfigToServer('skills', currentSkills);
        }
    };

    // --- Projects Management Logic ---

    let currentProjects = typeof projectsData !== 'undefined' ? [...projectsData] : [];
    const projectList = document.getElementById('project-list');
    const projectForm = document.getElementById('project-form');
    const projectEditIndexInput = document.getElementById('project-edit-index');
    const clearProjectFormBtn = document.getElementById('clear-project-form');

    function renderProjectList() {
        projectList.innerHTML = '';
        currentProjects.forEach((project, index) => {
            const item = document.createElement('div');
            item.className = 'cert-item glass';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div>
                        <h4 style="margin: 0;">${escapeHTML(project.title)}</h4>
                        <small style="color: #888;">${escapeHTML(project.desc)}</small>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="admin-action-btn" onclick="moveProject(${index}, -1)" title="Move Up"><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="admin-action-btn" onclick="moveProject(${index}, 1)" title="Move Down"><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="admin-action-btn" style="color: #00d4ff;" onclick="editProject(${index})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="admin-action-btn" style="color: #ff6b6b;" onclick="deleteProject(${index})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            projectList.appendChild(item);
        });
    }

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('project-title').value;
            const desc = document.getElementById('project-desc').value;
            const index = parseInt(projectEditIndexInput.value);

            const newProject = { title, desc };

            if (index >= 0) {
                currentProjects[index] = newProject;
            } else {
                currentProjects.push(newProject);
            }

            renderProjectList();
            saveConfigToServer('projects', currentProjects);
            resetProjectForm();
        });
    }

    function resetProjectForm() {
        projectForm.reset();
        projectEditIndexInput.value = '-1';
        document.querySelector('#tab-projects .editor-panel h3').textContent = 'Add / Edit Project';
    }

    if (clearProjectFormBtn) {
        clearProjectFormBtn.addEventListener('click', resetProjectForm);
    }

    window.editProject = function (index) {
        const project = currentProjects[index];
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-desc').value = project.desc;
        projectEditIndexInput.value = index;
        document.querySelector('#tab-projects .editor-panel h3').textContent = 'Edit Project';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteProject = function (index) {
        if (confirm('Are you sure you want to delete this project?')) {
            currentProjects.splice(index, 1);
            renderProjectList();
            saveConfigToServer('projects', currentProjects);
        }
    };

    window.moveProject = function (index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < currentProjects.length) {
            [currentProjects[index], currentProjects[newIndex]] = [currentProjects[newIndex], currentProjects[index]];
            renderProjectList();
            saveConfigToServer('projects', currentProjects);
        }
    };

    // Initial Render for Projects
    renderProjectList();


    // Initial Render for Skills
    renderSkillList();


    // Download Config Logic (Updated for separate buttons)

    // Download Certificates
    const saveCertsBtn = document.getElementById('save-certs-btn');
    if (saveCertsBtn) {
        saveCertsBtn.addEventListener('click', () => {
            downloadFile("const certificatesData = " + JSON.stringify(currentCertificates, null, 4) + ";", "certificates_data.js");
        });
    }

    // Download Skills
    const saveSkillsBtn = document.getElementById('save-skills-btn');
    if (saveSkillsBtn) {
        saveSkillsBtn.addEventListener('click', () => {
            downloadFile("const skillsData = " + JSON.stringify(currentSkills, null, 4) + ";", "skills_data.js");
        });
    }

    // Download Projects
    const saveProjectsBtn = document.getElementById('save-projects-btn');
    if (saveProjectsBtn) {
        saveProjectsBtn.addEventListener('click', () => {
            downloadFile("const projectsData = " + JSON.stringify(currentProjects, null, 4) + ";", "projects_data.js");
        });
    }

    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }




    // --- Blog Management Logic ---
    let currentBlogPosts = [];
    let currentBlogCategories = [];
    const blogList = document.getElementById('blog-list');
    const categoryManagerList = document.getElementById('category-manager-list');
    const blogForm = document.getElementById('blog-form');
    const blogEditIndexInput = document.getElementById('blog-edit-index');
    const clearBlogFormBtn = document.getElementById('clear-blog-form');

    // Async data loader for admin
    async function loadAdminBlogData() {
        try {
            let useOptimistic = false;
            const optRaw = localStorage.getItem('optimisticBlogData');
            if (optRaw) {
                try {
                    const optData = JSON.parse(optRaw);
                    if (Date.now() - optData.timestamp < 3 * 60 * 1000) { // 3 minutes
                        currentBlogPosts = optData.posts;
                        currentBlogCategories = optData.categories;
                        useOptimistic = true;
                    }
                } catch(e) {}
            }

            if (!useOptimistic) {
                let res = await fetch('/api/data?t=' + Date.now()).catch(() => null);
                if (res && res.ok) {
                    const data = await res.json();
                    currentBlogPosts = data.posts || [];
                    currentBlogCategories = data.categories || [];
                } else {
                    await new Promise(resolve => {
                        const script = document.createElement('script');
                        script.src = 'assets/js/data/blog_data.js?t=' + Date.now();
                        script.onload = resolve;
                        script.onerror = resolve;
                        document.head.appendChild(script);
                    });
                    if (typeof blogData !== 'undefined') {
                        currentBlogPosts = blogData.posts ? [...blogData.posts] : [];
                        currentBlogCategories = blogData.categories ? [...blogData.categories] : [];
                    }
                }
            }
        } catch(e) {
            console.error(e);
        }
        renderBlogList();
        renderCategoryManagerList();
    }
    loadAdminBlogData();

    function renderBlogList() {
        if (!blogList) return;
        blogList.innerHTML = '';
        currentBlogPosts.forEach((post, index) => {
            const item = document.createElement('div');
            item.className = 'cert-item glass';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div>
                        <h4 style="margin: 0;">${escapeHTML(post.title)}</h4>
                        <small style="color: #888;">${escapeHTML(post.id)} | ${escapeHTML(post.category)}</small>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="admin-action-btn" onclick="moveBlog(${index}, -1)" title="Move Up"><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="admin-action-btn" onclick="moveBlog(${index}, 1)" title="Move Down"><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="admin-action-btn" style="color: #00d4ff;" onclick="editBlog(${index})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="admin-action-btn" style="color: #ff6b6b;" onclick="deleteBlog(${index})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            blogList.appendChild(item);
        });
    }

    function renderCategoryManagerList() {
        if (!categoryManagerList) return;
        categoryManagerList.innerHTML = '';
        currentBlogCategories.forEach((cat, index) => {
            const item = document.createElement('div');
            item.className = 'cert-item glass';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div>
                        <h4 style="margin: 0;">${escapeHTML(cat)}</h4>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="admin-action-btn" style="color: #ff6b6b;" onclick="deleteCategory(${index})" title="Delete Category"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            categoryManagerList.appendChild(item);
        });
    }

    window.deleteCategory = async function (index) {
        const categoryName = currentBlogCategories[index];
        if (confirm(`Are you sure you want to delete the category '${categoryName}'? All blog posts in this category will be changed to 'Uncategorized'.`)) {
            // Remove from categories list
            currentBlogCategories.splice(index, 1);
            
            // Update posts categories
            currentBlogPosts.forEach(post => {
                if (post.category === categoryName) {
                    post.category = 'Uncategorized';
                }
            });

            // Save optimistic state locally
            localStorage.setItem('optimisticBlogData', JSON.stringify({
                timestamp: Date.now(),
                posts: currentBlogPosts,
                categories: currentBlogCategories
            }));

            // Sync to GitHub first
            if (localStorage.getItem('ghToken')) {
                const configObj = { posts: currentBlogPosts.map(p => { const { _mdContent, ...rest } = p; return rest; }), categories: currentBlogCategories };
                const jsRes = await window.pushToGitHub(`assets/js/data/blog_data.js`, "const blogData = " + JSON.stringify(configObj, null, 4) + ";", `docs: delete category ${categoryName} (JS)`);
                const jsonRes = await window.pushToGitHub(`assets/js/data/blog_data.json`, JSON.stringify(configObj, null, 4), `docs: delete category ${categoryName} (JSON)`);
                if (jsRes.ok && jsonRes.ok) {
                    setTimeout(() => alert("Category deleted directly from GitHub!"), 10);
                } else {
                    const errorMsg = (!jsRes.ok ? jsRes.error : '') + " " + (!jsonRes.ok ? jsonRes.error : '');
                    setTimeout(() => alert(`Failed to delete category from GitHub: ${errorMsg}.`), 10);
                }
            }

            // Sync to Railway live server bulk API
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    const res = await fetch('/api/blog-config', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            posts: currentBlogPosts.map(p => { const { _mdContent, ...rest } = p; return rest; }),
                            categories: currentBlogCategories
                        })
                    });
                    if (res.ok) {
                        setTimeout(() => alert("Saved category changes to live server!"), 10);
                    } else if (res.status === 401) {
                        alert("Session expired. Please log in again.");
                        localStorage.removeItem('adminLoggedIn');
                        localStorage.removeItem('adminToken');
                        document.cookie = "adminToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
                        window.location.reload();
                    } else {
                        setTimeout(() => alert("Failed to save category changes to live server!"), 10);
                    }
                } catch(err) {
                    setTimeout(() => alert("Live server unreachable for category update."), 10);
                }
            }

            renderCategoryManagerList();
            renderBlogList();
        }
    };

    if (blogForm) {
        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('blog-id').value.trim();
            const title = document.getElementById('blog-title').value.trim();
            const category = document.getElementById('blog-category').value.trim();
            const summary = document.getElementById('blog-summary').value.trim();
            const content = document.getElementById('blog-content').value;
            const index = parseInt(blogEditIndexInput.value);

            const newPost = {
                id,
                title,
                category,
                date: new Date().toISOString().split('T')[0],
                summary,
                file: `blogs/${id}.md`,
                _mdContent: content // temporarily stored for markdown download
            };

            // Add category if new
            if (!currentBlogCategories.includes(category)) {
                currentBlogCategories.push(category);
            }

            if (index >= 0) {
                // preserve old date if editing
                newPost.date = currentBlogPosts[index].date;
                currentBlogPosts[index] = newPost;
            } else {
                currentBlogPosts.push(newPost);
            }

            renderBlogList();
            renderCategoryManagerList();
            resetBlogForm();

            // Save optimistic state locally to mask GitHub deployment delay
            localStorage.setItem('optimisticBlogData', JSON.stringify({
                timestamp: Date.now(),
                posts: currentBlogPosts,
                categories: currentBlogCategories
            }));
            localStorage.setItem(`optimisticBlog_${id}`, JSON.stringify({
                timestamp: Date.now(),
                content: content
            }));
            
            // Try GitHub API Auto-Sync first
            if (localStorage.getItem('ghToken')) {
                const mdRes = await window.pushToGitHub(`blogs/${id}.md`, content, `docs: update blog ${id}.md`);
                const cleanPosts = currentBlogPosts.map(p => { const { _mdContent, ...rest } = p; return rest; });
                const configObj = { posts: cleanPosts, categories: currentBlogCategories };
                const jsRes = await window.pushToGitHub(`assets/js/data/blog_data.js`, "const blogData = " + JSON.stringify(configObj, null, 4) + ";", `docs: update blog config (JS)`);
                const jsonRes = await window.pushToGitHub(`assets/js/data/blog_data.json`, JSON.stringify(configObj, null, 4), `docs: update blog config (JSON)`);
                
                if (mdRes.ok && jsRes.ok && jsonRes.ok) {
                    setTimeout(() => alert("Saved directly to GitHub! Your live site will update in a minute."), 10);
                    if (!localStorage.getItem('adminToken')) {
                        return;
                    }
                } else {
                    const errorMsg = (!mdRes.ok ? mdRes.error : '') + " " + (!jsRes.ok ? jsRes.error : '') + " " + (!jsonRes.ok ? jsonRes.error : '');
                    setTimeout(() => alert(`Failed to save to GitHub: ${errorMsg}. Please check your token permissions or repository name in Settings. You can still save manually by downloading.`), 10);
                }
            }

            // Try to hit API if it exists (Railway), otherwise fallback to download
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    const res = await fetch('/api/posts', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ id, title, category, summary, content })
                    });
                    if (res.ok) {
                        setTimeout(() => alert("Saved to live server! You can still download files if you want."), 10);
                    } else if (res.status === 401) {
                        alert("Session expired. Please log in again.");
                        localStorage.removeItem('adminLoggedIn');
                        localStorage.removeItem('adminToken');
                        document.cookie = "adminToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
                        window.location.reload();
                    } else {
                        setTimeout(() => alert("Failed to save to live server! Please click BOTH download buttons to save manually."), 10);
                    }
                } catch(err) {
                    setTimeout(() => alert("Live server unreachable. Please click BOTH download buttons to save manually."), 10);
                }
            } else {
                setTimeout(() => alert("Saved to list locally! Make sure to click BOTH download buttons now to update files."), 10);
            }
        });
    }

    function resetBlogForm() {
        blogForm.reset();
        blogEditIndexInput.value = '-1';
        document.querySelector('#tab-blog .editor-panel h3').textContent = 'Add / Edit Blog Post';
    }

    if (clearBlogFormBtn) {
        clearBlogFormBtn.addEventListener('click', resetBlogForm);
    }

    window.editBlog = async function (index) {
        const post = currentBlogPosts[index];
        document.getElementById('blog-id').value = post.id;
        document.getElementById('blog-title').value = post.title;
        document.getElementById('blog-category').value = post.category;
        document.getElementById('blog-summary').value = post.summary || '';
        blogEditIndexInput.value = index;
        
        document.querySelector('#tab-blog .editor-panel h3').textContent = 'Edit Blog Post';

        // Fetch markdown content
        try {
            const isLocal = window.location.protocol === 'file:';
            const fetchUrl = isLocal ? post.file : `${post.file}?t=${Date.now()}`;
            const mdRes = await fetch(fetchUrl);
            if (mdRes.ok) {
                document.getElementById('blog-content').value = await mdRes.text();
            } else {
                document.getElementById('blog-content').value = post._mdContent || "Error loading file content.";
            }
        } catch (e) {
            document.getElementById('blog-content').value = post._mdContent || "";
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteBlog = async function (index) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            const post = currentBlogPosts[index];
            currentBlogPosts.splice(index, 1);
            renderBlogList();

            // Save optimistic state locally
            localStorage.setItem('optimisticBlogData', JSON.stringify({
                timestamp: Date.now(),
                posts: currentBlogPosts,
                categories: currentBlogCategories
            }));

            // Try GitHub API Auto-Sync first
            if (localStorage.getItem('ghToken')) {
                const mdRes = await window.deleteFromGitHub(`blogs/${post.id}.md`);
                const cleanPosts = currentBlogPosts.map(p => { const { _mdContent, ...rest } = p; return rest; });
                const configObj = { posts: cleanPosts, categories: currentBlogCategories };
                const jsRes = await window.pushToGitHub(`assets/js/data/blog_data.js`, "const blogData = " + JSON.stringify(configObj, null, 4) + ";", `docs: delete blog config for ${post.id} (JS)`);
                const jsonRes = await window.pushToGitHub(`assets/js/data/blog_data.json`, JSON.stringify(configObj, null, 4), `docs: delete blog config for ${post.id} (JSON)`);
                
                if (mdRes.ok && jsRes.ok && jsonRes.ok) {
                    setTimeout(() => alert("Deleted directly from GitHub!"), 10);
                    if (!localStorage.getItem('adminToken')) {
                        return; // Only return early if not running in live server API mode
                    }
                } else {
                    const errorMsg = (!mdRes.ok ? mdRes.error : '') + " " + (!jsRes.ok ? jsRes.error : '') + " " + (!jsonRes.ok ? jsonRes.error : '');
                    setTimeout(() => alert(`Failed to delete from GitHub: ${errorMsg}. Please check settings.`), 10);
                }
            }

            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    await fetch(`/api/posts/${post.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch(e) {
                    console.log("Failed to delete from live server.");
                }
            }
        }
    };

    window.moveBlog = function (index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < currentBlogPosts.length) {
            [currentBlogPosts[index], currentBlogPosts[newIndex]] = [currentBlogPosts[newIndex], currentBlogPosts[index]];
            renderBlogList();
        }
    };

    // Download Blog Config
    const saveBlogJsonBtn = document.getElementById('save-blog-json-btn');
    if (saveBlogJsonBtn) {
        saveBlogJsonBtn.addEventListener('click', () => {
            // Strip out _mdContent before saving JSON
            const cleanPosts = currentBlogPosts.map(p => {
                const { _mdContent, ...rest } = p;
                return rest;
            });
            const dataToSave = {
                posts: cleanPosts,
                categories: currentBlogCategories
            };
            downloadFile("const blogData = " + JSON.stringify(dataToSave, null, 4) + ";", "blog_data.js");
        });
    }

    // Download Markdown File
    const saveBlogMdBtn = document.getElementById('save-blog-md-btn');
    if (saveBlogMdBtn) {
        saveBlogMdBtn.addEventListener('click', () => {
            const content = document.getElementById('blog-content').value;
            const id = document.getElementById('blog-id').value.trim();
            if (!id || !content) {
                alert("Please fill out the ID and Content to download the markdown file.");
                return;
            }
            // Download as Markdown
            const blob = new Blob([content], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${id}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Initial Render
    renderCertList();
});
