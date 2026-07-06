import { escapeHTML } from './main.js';

export function initSettings() {
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
    
            if (token === '***SERVER_CONFIGURED***') {
                return { ok: true };
            }
    
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
    
            if (token === '***SERVER_CONFIGURED***') {
                return { ok: true };
            }
    
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
                        loginError.textContent = "Server connection error. Please try again later.";
                        loginError.style.display = 'block';
                        passwordInput.classList.add('shake');
                        setTimeout(() => passwordInput.classList.remove('shake'), 500);
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
    
}
