document.addEventListener('DOMContentLoaded', async () => {
    const categoryList = document.getElementById('category-list');
    const postsList = document.getElementById('posts-list');
    const postReader = document.getElementById('post-reader');
    const readerContent = document.getElementById('reader-content');
    const backButton = document.getElementById('back-button');
    
    // --- Setup Reading Font Size Bar ---
    function setupFontSizeBar() {
        if (!postReader || !readerContent) return;
        if (document.getElementById('blog-font-bar')) return;

        const fontBar = document.createElement('div');
        fontBar.id = 'blog-font-bar';
        fontBar.className = 'blog-font-bar';
        fontBar.setAttribute('role', 'toolbar');
        fontBar.setAttribute('aria-label', 'Blog reading preferences');
        fontBar.innerHTML = `
            <div class="font-bar-left">
                <i class="fa-solid fa-text-height" aria-hidden="true"></i>
                <span>Size</span>
            </div>
            <div class="font-bar-controls">
                <button id="font-dec-btn" class="font-ctrl-btn" aria-label="Decrease font size" title="Decrease size (Ctrl/Cmd + -)">A−</button>
                <span id="font-size-display" class="font-size-display" role="button" tabindex="0" aria-label="Current font size 100%, click to reset" title="Click to reset (Ctrl/Cmd + 0)">100%</span>
                <button id="font-inc-btn" class="font-ctrl-btn" aria-label="Increase font size" title="Increase size (Ctrl/Cmd + +)">A+</button>
            </div>
        `;

        const topBar = document.createElement('div');
        topBar.className = 'post-reader-top-bar';
        topBar.style.display = 'flex';
        topBar.style.justifyContent = 'space-between';
        topBar.style.alignItems = 'center';
        topBar.style.marginBottom = '30px';
        topBar.style.flexWrap = 'wrap';
        topBar.style.gap = '15px';

        if (backButton && backButton.parentNode === postReader) {
            postReader.insertBefore(topBar, backButton);
            topBar.appendChild(backButton);
            backButton.style.marginBottom = '0';
        } else {
            postReader.insertBefore(topBar, readerContent);
        }
        topBar.appendChild(fontBar);

        let toast = document.getElementById('font-size-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'font-size-toast';
            toast.className = 'font-size-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }

        let currentSize = 100;
        const savedSize = localStorage.getItem('blogFontSize');
        if (savedSize && !isNaN(savedSize)) {
            currentSize = Math.min(150, Math.max(80, parseInt(savedSize, 10)));
        }

        const decBtn = fontBar.querySelector('#font-dec-btn');
        const incBtn = fontBar.querySelector('#font-inc-btn');
        const display = fontBar.querySelector('#font-size-display');

        let toastTimer = null;
        function showToast(size) {
            toast.innerHTML = `<i class="fa-solid fa-text-height"></i> Reading Size: ${size}%`;
            toast.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => {
                toast.classList.remove('show');
            }, 1800);
        }

        function updateFontSize(newSize, notify = true) {
            currentSize = Math.min(150, Math.max(80, newSize));
            localStorage.setItem('blogFontSize', currentSize);
            display.textContent = `${currentSize}%`;
            display.setAttribute('aria-label', `Current font size ${currentSize}%, click to reset`);
            
            readerContent.style.setProperty('--blog-scale', currentSize / 100);
            
            decBtn.disabled = currentSize <= 80;
            incBtn.disabled = currentSize >= 150;

            if (notify) showToast(currentSize);
        }

        decBtn.addEventListener('click', () => updateFontSize(currentSize - 5));
        incBtn.addEventListener('click', () => updateFontSize(currentSize + 5));
        display.addEventListener('click', () => updateFontSize(100));
        display.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateFontSize(100);
            }
        });

        updateFontSize(currentSize, false);

        window.addEventListener('keydown', (e) => {
            if (postReader.style.display !== 'block') return;
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '=' || e.key === '+') {
                    e.preventDefault();
                    if (currentSize < 150) updateFontSize(currentSize + 5);
                } else if (e.key === '-') {
                    e.preventDefault();
                    if (currentSize > 80) updateFontSize(currentSize - 5);
                } else if (e.key === '0') {
                    e.preventDefault();
                    updateFontSize(100);
                }
            }
        });

        // --- INTENSE Cyberpunk Scroll Progress Bar Listener ---
        window.addEventListener('scroll', () => {
            const scrollBar = document.getElementById('neon-scroll-progress');
            if (!scrollBar || postReader.style.display !== 'block') return;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            scrollBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
        });
    }
    setupFontSizeBar();

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
    let currentPage = 1;
    const postsPerPage = 6;
    let currentFilteredPosts = [];
    let observer = null;

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
            // Only render admin buttons if user is admin AND currently on the admin page
            if (isAdmin && window.location.pathname.includes('blog-admin')) {
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
            const isLocal = window.location.protocol === 'file:';
            const fetchUrl = isLocal ? post.file : `${post.file}?t=${Date.now()}`;
            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const markdownContent = await response.text();
            const rawHtml = marked.parse(markdownContent);
            const safeHtml = DOMPurify.sanitize(rawHtml);
            
            readerContent.innerHTML = safeHtml;
            showReaderView();
            window.scrollTo(0, 0);

            // --- INTENSE METADATA & READING HACKS ---
            const words = markdownContent.trim().split(/\s+/).length;
            const readTime = Math.max(1, Math.ceil(words / 225));

            // 1. Dynamic SEO & JSON-LD Schema Injection
            document.title = `${post.title || 'Article'} | Anurag Pareek`;
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', post.summary || '');
            
            let jsonLd = document.getElementById('article-json-ld');
            if (!jsonLd) {
                jsonLd = document.createElement('script');
                jsonLd.id = 'article-json-ld';
                jsonLd.type = 'application/ld+json';
                document.head.appendChild(jsonLd);
            }
            jsonLd.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "TechArticle",
                "headline": post.title || "Tech Blog",
                "description": post.summary || "",
                "author": {
                    "@type": "Person",
                    "name": "Anurag Pareek",
                    "url": "https://anuragpareek016.engineer"
                },
                "datePublished": post.date || new Date().toISOString(),
                "wordCount": words,
                "keywords": post.category || "Software Engineering"
            });

            // 2. Intense Metadata Badge
            let metaBadge = document.getElementById('intense-meta-badge');
            if (!metaBadge) {
                metaBadge = document.createElement('div');
                metaBadge.id = 'intense-meta-badge';
                metaBadge.className = 'intense-meta-badge fade-in-up';
                readerContent.parentNode.insertBefore(metaBadge, readerContent);
            }
            metaBadge.innerHTML = `
                <span class="meta-pill"><i class="fa-regular fa-clock"></i> ${readTime} min read</span>
                <span class="meta-pill"><i class="fa-solid fa-align-left"></i> ${words} words</span>
                <span class="meta-pill category"><i class="fa-solid fa-tag"></i> ${post.category || 'Engineering'}</span>
                ${post.date ? `<span class="meta-pill"><i class="fa-regular fa-calendar"></i> ${post.date}</span>` : ''}
            `;
            metaBadge.style.display = 'flex';

            // 3. Cyberpunk Top Scroll Progress Bar
            let scrollBar = document.getElementById('neon-scroll-progress');
            if (!scrollBar) {
                scrollBar = document.createElement('div');
                scrollBar.id = 'neon-scroll-progress';
                scrollBar.className = 'neon-scroll-progress';
                document.body.appendChild(scrollBar);
            }
            scrollBar.style.width = '0%';
            scrollBar.style.opacity = '1';

            // 4. One-Click Copy Superpower on Code Blocks
            readerContent.querySelectorAll('pre').forEach(pre => {
                if (pre.querySelector('.copy-code-btn')) return;
                const btn = document.createElement('button');
                btn.className = 'copy-code-btn';
                btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
                btn.title = "Copy code to clipboard";
                btn.addEventListener('click', async () => {
                    const codeText = pre.querySelector('code')?.innerText || pre.innerText;
                    try {
                        await navigator.clipboard.writeText(codeText);
                        btn.innerHTML = `<i class="fa-solid fa-check" style="color: #2ed573;"></i> Copied!`;
                        setTimeout(() => btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`, 2000);
                    } catch (err) {
                        console.error(err);
                    }
                });
                pre.appendChild(btn);
            });

        } catch (error) {
            console.error('Error loading markdown file:', error);
            readerContent.innerHTML = '<p>Error loading content.</p>';
            showReaderView();
        }
    }

    function showListView() {
        postReader.style.setProperty('display', 'none', 'important');
        postsList.style.setProperty('display', 'grid', 'important');
        
        const categoryList = document.getElementById('category-list');
        if (categoryList) categoryList.style.removeProperty('display');
        
        const introText = document.querySelector('.games-intro');
        if (introText) introText.style.removeProperty('display');

        const tabButtons = document.querySelector('.tab-buttons');
        if (tabButtons) tabButtons.style.removeProperty('display');

        document.title = "Articles & Blog | Anurag Pareek";
        const scrollBar = document.getElementById('neon-scroll-progress');
        if (scrollBar) scrollBar.style.opacity = '0';
    }

    function showReaderView() {
        postsList.style.setProperty('display', 'none', 'important');
        postReader.style.setProperty('display', 'block', 'important');

        const categoryList = document.getElementById('category-list');
        if (categoryList) categoryList.style.setProperty('display', 'none', 'important');

        const introText = document.querySelector('.games-intro');
        if (introText) introText.style.setProperty('display', 'none', 'important');

        const tabButtons = document.querySelector('.tab-buttons');
        if (tabButtons) tabButtons.style.setProperty('display', 'none', 'important');
    }

    backButton.addEventListener('click', () => {
        showListView();
    });

});
