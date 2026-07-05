const fs = require('fs');

function revertWidths(filePath) {
    let css = fs.readFileSync(filePath, 'utf8');

    // Replace width: min(XX%, YYYpx); max-width: none; back to max-width: YYYpx; width: 100%;
    css = css.replace(/width:\s*min\(\d+%,\s*800px\);\s*max-width:\s*none;/g, 'width: 100%; max-width: 800px;');
    css = css.replace(/width:\s*min\(\d+%,\s*1000px\);\s*max-width:\s*none;/g, 'width: 100%; max-width: 1000px;');
    css = css.replace(/width:\s*min\(\d+%,\s*1200px\);\s*max-width:\s*none;/g, 'width: 100%; max-width: 1200px;');
    css = css.replace(/width:\s*min\(\d+%,\s*600px\);\s*max-width:\s*none;/g, 'width: 100%; max-width: 600px;');

    fs.writeFileSync(filePath, css);
    console.log(`Reverted widths in: ${filePath}`);
}

revertWidths('assets/css/style.css');
