const fs = require('fs');
function makeTransparent(file) {
    let css = fs.readFileSync(file, 'utf8');

    // Make glass-bg entirely transparent or even more subtle
    css = css.replace(/--glass-bg:\s*rgba\(255, 255, 255, 0\.02\);/g, '--glass-bg: rgba(255, 255, 255, 0.005);');
    
    // Change any rgba(255, 255, 255, 0.05) to 0.02
    css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.05\)/g, 'rgba(255, 255, 255, 0.015)');
    
    // Change any rgba(255, 255, 255, 0.08) to 0.03
    css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.08\)/g, 'rgba(255, 255, 255, 0.03)');

    // Change any rgba(255, 255, 255, 0.1) to 0.04
    css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, 'rgba(255, 255, 255, 0.04)');

    // Fix solid black/dark boxes in cyber_theme.css
    css = css.replace(/background:\s*#000\s*!important;/g, 'background: rgba(0, 0, 0, 0.5) !important;');
    css = css.replace(/background:\s*#111\s*!important;/g, 'background: rgba(17, 17, 17, 0.5) !important;');
    css = css.replace(/background:\s*#050505\s*!important;/g, 'background: rgba(5, 5, 5, 0.5) !important;');
    css = css.replace(/background:\s*rgba\(6, 6, 6, 0\.9\)\s*!important;/g, 'background: rgba(6, 6, 6, 0.4) !important;');

    fs.writeFileSync(file, css);
    console.log('Processed', file);
}

makeTransparent('assets/css/core/style.css');
try { makeTransparent('assets/css/core/cyber_theme.css'); } catch(e) {}
try { makeTransparent('assets/css/features/identity.css'); } catch(e) {}
try { makeTransparent('assets/css/features/intense_pack.css'); } catch(e) {}

