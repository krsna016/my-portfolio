import { initCertificates } from './certificates.module.js';
import { initSkills } from './skills.module.js';
import { initProjects } from './projects.module.js';
import { initSettings } from './settings.module.js';
import { initBlog } from './blog.module.js';

export function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

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


document.addEventListener('DOMContentLoaded', () => {
    // Sync token state on boot
    let token = localStorage.getItem('adminToken');
    
    function parseCookies(cookieHeader) {
        const list = {};
        if (!cookieHeader) return list;
        cookieHeader.split(';').forEach(cookie => {
            let parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;
    }

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

    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const adminContainer = document.querySelector('.admin-container');
    const navbar = document.querySelector('.navbar');

    async function checkAuthentication() {
        if (adminContainer) {
            if (!token) {
                window.location.href = 'admin.html';
                return;
            }
            try {
                const res = await fetch('/api/check-auth', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
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
        
        if (loginOverlay && token) {
            try {
                const res = await fetch('/api/check-auth', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
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
    

    // Initialize sub-modules if on panel page
    if (adminContainer) {
        initSettings();
        initCertificates();
        initSkills();
        initProjects();
        initBlog();
        
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
        
    }

    // Setup login/logout events
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = passwordInput.value;
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('adminLoggedIn', 'true');
                    localStorage.setItem('adminToken', data.token);
                    document.cookie = "adminToken=" + data.token + "; Path=/; Max-Age=86400; SameSite=Strict";
                    loginOverlay.style.display = 'none';
                    passwordInput.value = '';
                    window.location.reload();
                } else {
                    loginError.textContent = "Incorrect password.";
                    loginError.style.display = 'block';
                    passwordInput.classList.add('shake');
                    setTimeout(() => passwordInput.classList.remove('shake'), 500);
                }
            } catch (err) {
                loginError.textContent = "Server connection error. Please try again later.";
                loginError.style.display = 'block';
                passwordInput.classList.add('shake');
                setTimeout(() => passwordInput.classList.remove('shake'), 500);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminToken');
            document.cookie = "adminToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
            window.location.href = 'admin.html';
        });
    }
});
