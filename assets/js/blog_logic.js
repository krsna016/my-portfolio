document.addEventListener('DOMContentLoaded', async () => {
    const categoryList = document.getElementById('category-list');
    const postsList = document.getElementById('posts-list');
    const postReader = document.getElementById('post-reader');
    const readerContent = document.getElementById('reader-content');
    const backButton = document.getElementById('back-button');
    
    // Admin elements
    const adminControls = document.getElementById('admin-controls');
    const showLoginBtn = document.getElementById('show-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    
    // Modal elements
    const newPostBtn = document.getElementById('new-post-btn');
    const modal = document.getElementById('admin-modal');
    const closeBtn = document.getElementById('close-modal');
    const saveBtn = document.getElementById('save-post-btn');
    let isAdmin = false;

    // Attach Modal Listeners immediately to guarantee they work even if fetch fails
    if(newPostBtn && modal) {
        newPostBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            document.getElementById('admin-form').reset();
            document.getElementById('admin-id').readOnly = false;
            document.getElementById('modal-title').textContent = "New Post";
        });
    }

    if(closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if(saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const id = document.getElementById('admin-id').value;
            const title = document.getElementById('admin-title').value;
            const category = document.getElementById('admin-category').value;
            const summary = document.getElementById('admin-summary').value;
            const content = document.getElementById('admin-content').value;

            if(!id || !title || !category || !content) {
                alert("Please fill in all required fields.");
                return;
            }

            const token = localStorage.getItem('adminToken');
            const payload = { id, title, category, summary, content };

            try {
                const res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                
                if(res.ok) {
                    alert("Post saved successfully!");
                    location.reload();
                } else {
                    alert("Failed to save. Your session may have expired.");
                    isAdmin = false; updateAdminUI();
                }
            } catch(e) {
                console.error(e);
            }
        });
    }

    
    let currentCategory = 'All';
    let blogPosts = [];
    let blogCategories = [];

    // Initialize Marked options
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                } else {
                    return hljs.highlightAuto(code).value;
                }
            },
            breaks: true,
            gfm: true
        });
    }

    // Check Auth Status
    async function checkAuth() {
        const token = localStorage.getItem('adminToken');
        if (!token) return false;
        
        try {
            const res = await fetch('/api/check-auth', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.ok;
        } catch(e) {
            return false;
        }
    }

    isAdmin = await checkAuth();

    function updateAdminUI() {
        if (isAdmin && adminControls) {
            if(adminControls) adminControls.style.display = 'block';
            if(showLoginBtn) showLoginBtn.style.display = 'none';
            if(logoutBtn) logoutBtn.style.display = 'inline-block';
            if(loginModal) loginModal.style.display = 'none'; // Auto-hide if already logged in
        } else if (adminControls) {
            if(adminControls) adminControls.style.display = 'none';
            if(showLoginBtn) showLoginBtn.style.display = 'inline-block';
            if(logoutBtn) logoutBtn.style.display = 'none';
            
            // Auto-show login if on admin page
            if(window.location.pathname.includes('blog-admin') && loginModal) {
                loginModal.style.display = 'flex';
            }
        }
        renderPosts();
    }

    // Login logic
    if (showLoginBtn) {
        if(showLoginBtn) showLoginBtn.addEventListener('click', () => {
            if(loginModal) loginModal.style.display = 'flex';
        });
    }

    if (logoutBtn) {
        if(logoutBtn) logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            isAdmin = false;
            updateAdminUI();
            alert("Logged out successfully");
        });
    }

    document.getElementById('close-login-btn')?.addEventListener('click', () => {
        if(loginModal) loginModal.style.display = 'none';
    });

    document.getElementById('submit-login-btn')?.addEventListener('click', async () => {
        const password = document.getElementById('login-password').value;
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('adminToken', data.token);
                isAdmin = true;
                if(loginModal) loginModal.style.display = 'none';
                document.getElementById('login-password').value = '';
                updateAdminUI();
            } else {
                alert("Invalid password");
            }
        } catch(e) {
            console.error(e);
        }
    });

    // Fetch blog data
    try {
        const res = await fetch('/api/data');
        if (!res.ok) {
            const fallbackRes = await fetch('assets/js/blog_data.json');
            const data = await fallbackRes.json();
            blogPosts = data.posts;
            blogCategories = data.categories;
        } else {
            const data = await res.json();
            blogPosts = data.posts;
            blogCategories = data.categories;
        }
    } catch(e) {
        console.error("Failed to fetch blog data", e);
    }

    updateAdminUI();

    // Populate Categories
    try {
        if(blogCategories && Array.isArray(blogCategories)) {
            blogCategories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = category;
                li.dataset.category = category;
                li.addEventListener('click', () => {
                    document.querySelectorAll('.category-list li').forEach(el => el.classList.remove('active'));
                    li.classList.add('active');
                    currentCategory = category;
                    renderPosts();
                    showListView();
                });
                categoryList.appendChild(li);
            });
        }
    } catch (e) {
        console.error("Error populating categories:", e);
    }

    if(categoryList.firstElementChild) {
        categoryList.firstElementChild.addEventListener('click', (e) => {
            document.querySelectorAll('.category-list li').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = 'All';
            renderPosts();
            showListView();
        });
    }

    let currentPage = 1;
    const postsPerPage = 6;
    let currentFilteredPosts = [];
    let observer = null;

    function renderPosts() {
        try {
            postsList.innerHTML = '';
            currentPage = 1;
            
            currentFilteredPosts = currentCategory === 'All' 
                ? blogPosts 
                : blogPosts.filter(post => post && post.category === currentCategory);

            if (!currentFilteredPosts || currentFilteredPosts.length === 0) {
                postsList.innerHTML = '<p style="color: #aaa;">No posts found in this category.</p>';
                return;
            }

            renderPage();
            setupObserver();
        } catch (e) {
            console.error("Error rendering posts:", e);
            postsList.innerHTML = `<p style="color: #e74c3c;">Error rendering posts: ${e.message || e}</p>`;
        }
    }

    function renderPage() {
        if (!currentFilteredPosts || !Array.isArray(currentFilteredPosts)) return;

        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToRender = currentFilteredPosts.slice(start, end);

        postsToRender.forEach(post => {
            if (!post) return;

            const card = document.createElement('div');
            card.className = 'blog-card glass fade-in-up';
            card.style.cursor = 'pointer';
            
            let adminHTML = '';
            if (isAdmin) {
                adminHTML = `
                <div class="post-admin-actions" style="margin-top: 15px; width: 100%; display: flex; justify-content: center; gap: 10px;">
                    <button class="btn secondary" onclick="event.stopPropagation(); deletePost('${post.id}')" style="padding: 5px 10px; font-size: 0.8rem; background: #e74c3c; color: white; border-radius: 20px;">Delete</button>
                    <button class="btn secondary" onclick="event.stopPropagation(); editPost('${post.id}')" style="padding: 5px 10px; font-size: 0.8rem; border-radius: 20px;">Edit</button>
                </div>
                `;
            }

            let iconClass = "fa-newspaper";
            const cat = post.category ? String(post.category).toLowerCase() : "";
            if(cat.includes("code") || cat.includes("dev")) iconClass = "fa-code";
            if(cat.includes("dsa") || cat.includes("algo")) iconClass = "fa-laptop-code";
            if(cat.includes("design")) iconClass = "fa-pen-ruler";

            card.innerHTML = `
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-category">${post.category || "Uncategorized"}</span>
                        <span class="blog-date">${post.date || ""}</span>
                    </div>
                    <h3 class="blog-title">${post.title || "Untitled Post"}</h3>
                    <p class="blog-summary">${post.summary || "Read more about this topic..."}</p>
                    <div class="blog-footer">
                        <span class="read-more">Read Article <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </div>
                ${adminHTML}
            `;
            card.addEventListener('click', () => loadPost(post));
            postsList.appendChild(card);
        });
        currentPage++;
    }

    function setupObserver() {
        if (observer) observer.disconnect();
        
        const oldSentinel = document.getElementById('scroll-sentinel');
        if (oldSentinel) oldSentinel.remove();

        if ((currentPage - 1) * postsPerPage >= currentFilteredPosts.length) return;

        const sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '20px';
        sentinel.style.width = '100%';
        postsList.appendChild(sentinel);

        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                renderPage();
                postsList.appendChild(sentinel);
                if ((currentPage - 1) * postsPerPage >= currentFilteredPosts.length) {
                    observer.disconnect();
                    sentinel.remove();
                }
            }
        });
        observer.observe(sentinel);
    }

    window.deletePost = async function(id) {
        if(!confirm("Are you sure you want to delete this post?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`/api/posts/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                alert("Post deleted!");
                location.reload();
            } else {
                alert("Failed to delete. Session might be expired.");
                isAdmin = false; updateAdminUI();
            }
        } catch(e) { console.error(e); }
    }

    window.editPost = async function(id) {
        const post = blogPosts.find(p => p.id === id);
        if(!post) return;
        
        const res = await fetch(post.file);
        const mdContent = await res.text();
        
        document.getElementById('admin-modal').style.display = 'flex';
        document.getElementById('admin-id').value = post.id;
        document.getElementById('admin-id').readOnly = true;
        document.getElementById('admin-title').value = post.title;
        document.getElementById('admin-category').value = post.category;
        document.getElementById('admin-summary').value = post.summary;
        document.getElementById('admin-content').value = mdContent;
        document.getElementById('modal-title').textContent = "Edit Post";
    }

    async function loadPost(post) {
        try {
            const response = await fetch(post.file + "?t=" + new Date().getTime());
            if (!response.ok) throw new Error('Network response was not ok');
            const markdownContent = await response.text();
            const rawHtml = marked.parse(markdownContent);
            const safeHtml = DOMPurify.sanitize(rawHtml);
            
            readerContent.innerHTML = safeHtml;
            showReaderView();
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error loading markdown file:', error);
            readerContent.innerHTML = '<p>Error loading content.</p>';
            showReaderView();
        }
    }

    function showListView() {
        postReader.style.display = 'none';
        postsList.style.display = 'grid'; // Restore grid
        // Do not force flex column so that cards form a beautiful grid
    }

    function showReaderView() {
        postsList.style.display = 'none';
        postReader.style.display = 'block';
    }

    backButton.addEventListener('click', () => {
        showListView();
    });

});
