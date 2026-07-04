const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/admin.html');
    
    // Login
    await page.type('#admin-password', 'admin123');
    await page.click('#login-form button[type="submit"]');
    await page.waitForTimeout(500);
    
    // Switch to Blog tab
    await page.evaluate(() => {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tab === 'blog') btn.click();
        });
    });
    
    // Fill out the blog form
    await page.type('#blog-id', 'test-id');
    await page.type('#blog-title', 'Test Title');
    await page.type('#blog-category', 'Testing');
    await page.type('#blog-content', '# Hello World');
    
    // Handle the alert dialog so it doesn't block execution
    page.on('dialog', async dialog => {
        console.log("Dialog message: " + dialog.message());
        await dialog.accept();
    });
    
    // Submit the form
    await page.click('#blog-form button[type="submit"]');
    await page.waitForTimeout(500);
    
    // Check if the blog list has the item
    const html = await page.$eval('#blog-list', el => el.innerHTML);
    console.log("Blog List HTML:\n" + html);
    
    await browser.close();
})();
