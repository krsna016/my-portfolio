import { escapeHTML, saveConfigToServer } from './main.js';

export function initSkills() {
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
    
}
