document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Logic ---
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        loginOverlay.style.display = 'none';
    }
    const biometricBtn = document.getElementById('biometric-btn');

    // Login Form Submit (Fallback)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = passwordInput.value;
            if (password === 'admin123') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                }).then(res => res.ok ? res.json() : null)
                  .then(data => { if(data && data.token) sessionStorage.setItem('adminToken', data.token); })
                  .catch(err => console.log('No backend API found, running in static mode.'));

                loginOverlay.style.display = 'none';
                loginError.style.display = 'none';
                passwordInput.value = '';
            } else {
                loginError.style.display = 'block';
                passwordInput.classList.add('shake');
                setTimeout(() => passwordInput.classList.remove('shake'), 500);
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
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: 'admin123' }) // Assuming default backend password for biometric success
                    }).then(res => res.ok ? res.json() : null)
                      .then(data => { if(data && data.token) sessionStorage.setItem('adminToken', data.token); })
                      .catch(err => console.log('No backend API found.'));

                    loginOverlay.style.display = 'none';
                    loginError.style.display = 'none';
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
            sessionStorage.removeItem('adminLoggedIn');
            window.location.reload();
        });
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
            item.className = 'cert-item';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 50%;">
                        <i class="${cert.icon}" style="color: ${cert.color || '#fff'}"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0;">${cert.title}</h4>
                        <small style="color: #888;">${cert.file}</small>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="btn-icon btn-up" onclick="moveCert(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon btn-down" onclick="moveCert(${index}, 1)" ${index === currentCertificates.length - 1 ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editCert(${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteCert(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
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
        }
    };

    window.moveCert = function (index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < currentCertificates.length) {
            [currentCertificates[index], currentCertificates[newIndex]] = [currentCertificates[newIndex], currentCertificates[index]];
            renderCertList();
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
            item.className = 'cert-item';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div>
                        <h4 style="margin: 0;">${skill.name}</h4>
                        <small style="color: #888;">${skill.desc}</small>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="btn-icon btn-up" onclick="moveSkill(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon btn-down" onclick="moveSkill(${index}, 1)" ${index === currentSkills.length - 1 ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editSkill(${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteSkill(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
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
        }
    };

    window.moveSkill = function (index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < currentSkills.length) {
            [currentSkills[index], currentSkills[newIndex]] = [currentSkills[newIndex], currentSkills[index]];
            renderSkillList();
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
            item.className = 'cert-item';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div>
                        <h4 style="margin: 0;">${project.title}</h4>
                        <small style="color: #888;">${project.desc}</small>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="btn-icon btn-up" onclick="moveProject(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon btn-down" onclick="moveProject(${index}, 1)" ${index === currentProjects.length - 1 ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editProject(${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteProject(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
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
        }
    };

    window.moveProject = function (index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < currentProjects.length) {
            [currentProjects[index], currentProjects[newIndex]] = [currentProjects[newIndex], currentProjects[index]];
            renderProjectList();
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


    // Reload Button
    const loadBtn = document.getElementById('load-json-btn');
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            if (confirm('Reloading will discard unsaved changes. Continue?')) {
                window.location.reload();
            }
        });
    }

    // --- Blog Management Logic ---
    let currentBlogPosts = [];
    let currentBlogCategories = [];
    const blogList = document.getElementById('blog-list');
    const blogForm = document.getElementById('blog-form');
    const blogEditIndexInput = document.getElementById('blog-edit-index');
    const clearBlogFormBtn = document.getElementById('clear-blog-form');

    // Fetch existing blog data
    fetch('assets/js/blog_data.json')
        .then(res => res.json())
        .then(data => {
            currentBlogPosts = data.posts || [];
            currentBlogCategories = data.categories || [];
            renderBlogList();
        })
        .catch(err => {
            console.error("Failed to load blog data:", err);
            currentBlogPosts = [];
            currentBlogCategories = [];
            renderBlogList();
        });

    function renderBlogList() {
        if (!blogList) return;
        blogList.innerHTML = '';
        currentBlogPosts.forEach((post, index) => {
            const item = document.createElement('div');
            item.className = 'cert-item';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div>
                        <h4 style="margin: 0;">${post.title}</h4>
                        <small style="color: #888;">${post.id} | ${post.category}</small>
                    </div>
                </div>
                <div class="cert-item-actions">
                    <button class="btn-icon btn-up" onclick="moveBlog(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon btn-down" onclick="moveBlog(${index}, 1)" ${index === currentBlogPosts.length - 1 ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editBlog(${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteBlog(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            blogList.appendChild(item);
        });
    }

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
            
            // Try to hit API if it exists (Railway), otherwise fallback to download
            const token = sessionStorage.getItem('adminToken');
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
                        alert("Saved to live server! You can still download files if you want.");
                    } else {
                        alert("Failed to save to live server! Please click BOTH download buttons to save manually.");
                    }
                } catch(err) {
                    alert("Live server unreachable. Please click BOTH download buttons to save manually.");
                }
            } else {
                alert("Saved to list locally! Make sure to click BOTH download buttons now to update files.");
            }
        });
    }

    if (clearBlogFormBtn) {
        clearBlogFormBtn.addEventListener('click', () => {
            blogForm.reset();
            blogEditIndexInput.value = '-1';
            document.querySelector('#tab-blog .editor-panel h3').textContent = 'Add / Edit Blog Post';
        });
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
            const mdRes = await fetch(post.file);
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

            const token = sessionStorage.getItem('adminToken');
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
            downloadFile(JSON.stringify(dataToSave, null, 4), "blog_data.json");
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
