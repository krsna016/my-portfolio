const { JSDOM } = require("jsdom");
const html = `
<!DOCTYPE html>
<html>
<body>
    <form id="blog-form">
        <input type="hidden" id="blog-edit-index" value="-1">
        <input type="text" id="blog-id" value="test-id">
        <input type="text" id="blog-title" value="Test Title">
        <input type="text" id="blog-category" value="Cat">
        <input type="text" id="blog-summary" value="Sum">
        <textarea id="blog-content">Cont</textarea>
        <button type="submit">Save</button>
    </form>
    <div id="blog-list"></div>
    <script>
        let currentBlogPosts = [];
        let currentBlogCategories = [];
        const blogForm = document.getElementById('blog-form');
        const blogList = document.getElementById('blog-list');
        const blogEditIndexInput = document.getElementById('blog-edit-index');

        function renderBlogList() {
            blogList.innerHTML = '';
            currentBlogPosts.forEach((post, index) => {
                const item = document.createElement('div');
                item.className = 'cert-item';
                item.innerHTML = "<h4>" + post.title + "</h4>";
                blogList.appendChild(item);
            });
        }

        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('blog-id').value.trim();
            const title = document.getElementById('blog-title').value.trim();
            const category = document.getElementById('blog-category').value.trim();
            const summary = document.getElementById('blog-summary').value.trim();
            const content = document.getElementById('blog-content').value;
            const index = parseInt(blogEditIndexInput.value);

            const newPost = { id, title, category, summary, _mdContent: content };

            if (index >= 0) {
                currentBlogPosts[index] = newPost;
            } else {
                currentBlogPosts.push(newPost);
            }

            renderBlogList();
            console.log("Form submitted. List now has:", currentBlogPosts.length, "items.");
            console.log("List HTML:", blogList.innerHTML);
        });
    </script>
</body>
</html>
`;
const dom = new JSDOM(html, { runScripts: "dangerously" });
setTimeout(() => {
    const form = dom.window.document.getElementById("blog-form");
    form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
}, 100);
