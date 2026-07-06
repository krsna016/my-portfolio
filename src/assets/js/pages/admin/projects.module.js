import { escapeHTML, saveConfigToServer } from './main.js';

export function initProjects() {
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
    
    
    
    
}
