const fs = require('fs');

function reduceBlur(filePath) {
    let css = fs.readFileSync(filePath, 'utf8');

    // Reduce strong blurs to a very faint distortion to prevent grey-out effect
    css = css.replace(/blur\(16px\)/g, 'blur(3px)');
    css = css.replace(/blur\(15px\)/g, 'blur(3px)');
    css = css.replace(/blur\(10px\)/g, 'blur(2px)');
    css = css.replace(/blur\(20px\)/g, 'blur(4px)');
    css = css.replace(/blur\(8px\)/g, 'blur(2px)');

    // Reduce any remaining dark grey overlays to be almost completely see-through
    css = css.replace(/rgba\(0,\s*0,\s*0,\s*0\.5\)/g, 'rgba(0, 0, 0, 0.1)');
    css = css.replace(/rgba\(17,\s*17,\s*17,\s*0\.5\)/g, 'rgba(0, 0, 0, 0.1)');
    css = css.replace(/rgba\(5,\s*5,\s*5,\s*0\.5\)/g, 'rgba(0, 0, 0, 0.1)');
    css = css.replace(/rgba\(6,\s*6,\s*6,\s*0\.4\)/g, 'rgba(0, 0, 0, 0.1)');

    fs.writeFileSync(filePath, css);
    console.log(`Reduced blur in: ${filePath}`);
}

reduceBlur('assets/css/core/style.css');
try { reduceBlur('assets/css/core/cyber_theme.css'); } catch(e) {}
try { reduceBlur('assets/css/features/identity.css'); } catch(e) {}
try { reduceBlur('assets/css/features/intense_pack.css'); } catch(e) {}

