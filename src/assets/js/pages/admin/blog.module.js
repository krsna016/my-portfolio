import { escapeHTML } from './main.js';

export function initBlog() {
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
    
}
