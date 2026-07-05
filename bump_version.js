const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\.css\?v=\d+/g, '.css?v=133');
    content = content.replace(/\.js\?v=\d+/g, '.js?v=133');
    fs.writeFileSync(file, content);
    console.log(`Bumped version in ${file}`);
});
