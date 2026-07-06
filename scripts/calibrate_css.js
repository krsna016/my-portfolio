const fs = require('fs');

function calibrateCSS(filePath) {
    let css = fs.readFileSync(filePath, 'utf8');

    // 1. Upgrade Root Variables for Better Cross-Device Contrast
    css = css.replace(/--glass-bg:\s*rgba\(0,\s*0,\s*0,\s*0\.1\);/g, '--glass-bg: rgba(255, 255, 255, 0.02); /* Optimized for sRGB displays */');
    css = css.replace(/--glass-border:\s*rgba\(255,\s*255,\s*255,\s*0\.1\);/g, '--glass-border: rgba(255, 255, 255, 0.07);');
    css = css.replace(/--card-hover:\s*rgba\(255,\s*255,\s*255,\s*0\.1\);/g, '--card-hover: rgba(255, 255, 255, 0.05);');

    // 2. Fluid Typography Scaling
    const fontReplacements = [
        { regex: /font-size:\s*0\.8rem;/g, replacement: 'font-size: clamp(0.75rem, 1.5vw, 0.85rem);' },
        { regex: /font-size:\s*0\.85rem;/g, replacement: 'font-size: clamp(0.8rem, 1.8vw, 0.95rem);' },
        { regex: /font-size:\s*0\.9rem;/g, replacement: 'font-size: clamp(0.85rem, 2vw, 1rem);' },
        { regex: /font-size:\s*1rem;/g, replacement: 'font-size: clamp(0.9rem, 2.2vw, 1.1rem);' },
        { regex: /font-size:\s*1\.1rem;/g, replacement: 'font-size: clamp(1rem, 2.5vw, 1.25rem);' },
        { regex: /font-size:\s*1\.2rem;/g, replacement: 'font-size: clamp(1.1rem, 3vw, 1.3rem);' },
        { regex: /font-size:\s*1\.5rem;/g, replacement: 'font-size: clamp(1.3rem, 3.5vw, 1.6rem);' },
        { regex: /font-size:\s*1\.8rem;/g, replacement: 'font-size: clamp(1.5rem, 4vw, 2rem);' },
        { regex: /font-size:\s*2rem;/g, replacement: 'font-size: clamp(1.6rem, 5vw, 2.2rem);' },
        { regex: /font-size:\s*2\.2rem;/g, replacement: 'font-size: clamp(1.8rem, 5.5vw, 2.5rem);' },
        { regex: /font-size:\s*2\.5rem;/g, replacement: 'font-size: clamp(2rem, 6vw, 3rem);' },
        { regex: /font-size:\s*3rem;/g, replacement: 'font-size: clamp(2.2rem, 7vw, 3.5rem);' },
        { regex: /font-size:\s*4rem;/g, replacement: 'font-size: clamp(2.5rem, 8vw, 4.5rem);' },
        { regex: /font-size:\s*4\.5rem;/g, replacement: 'font-size: clamp(2.8rem, 9vw, 5rem);' },
        { regex: /font-size:\s*5rem;/g, replacement: 'font-size: clamp(3rem, 10vw, 6rem);' }
    ];
    fontReplacements.forEach(({ regex, replacement }) => {
        css = css.replace(regex, replacement);
    });

    // 3. Fluid Spacing (Padding/Margin)
    // padding: 2rem;
    css = css.replace(/padding:\s*2rem;/g, 'padding: clamp(1rem, 4vw, 2rem);');
    css = css.replace(/padding:\s*1\.5rem;/g, 'padding: clamp(0.8rem, 3vw, 1.5rem);');
    css = css.replace(/padding:\s*1rem;/g, 'padding: clamp(0.5rem, 2vw, 1rem);');
    css = css.replace(/padding:\s*2rem\s+1rem;/g, 'padding: clamp(1rem, 4vw, 2rem) clamp(0.5rem, 2vw, 1rem);');
    css = css.replace(/padding:\s*3rem\s+1rem;/g, 'padding: clamp(1.5rem, 5vw, 3rem) clamp(0.5rem, 2vw, 1rem);');
    
    css = css.replace(/margin-bottom:\s*2rem;/g, 'margin-bottom: clamp(1rem, 4vw, 2rem);');
    css = css.replace(/margin-bottom:\s*1\.5rem;/g, 'margin-bottom: clamp(0.8rem, 3vw, 1.5rem);');
    css = css.replace(/margin-bottom:\s*1rem;/g, 'margin-bottom: clamp(0.5rem, 2vw, 1rem);');
    
    css = css.replace(/margin-top:\s*2rem;/g, 'margin-top: clamp(1rem, 4vw, 2rem);');
    css = css.replace(/margin-top:\s*3rem;/g, 'margin-top: clamp(1.5rem, 5vw, 3rem);');

    // 4. Container Sizing (Max Widths)
    css = css.replace(/max-width:\s*800px;/g, 'width: min(90%, 800px); max-width: none;');
    css = css.replace(/max-width:\s*1000px;/g, 'width: min(92%, 1000px); max-width: none;');
    css = css.replace(/max-width:\s*1200px;/g, 'width: min(95%, 1200px); max-width: none;');
    css = css.replace(/max-width:\s*600px;/g, 'width: min(95%, 600px); max-width: none;');

    fs.writeFileSync(filePath, css);
    console.log(`Calibrated: ${filePath}`);
}

calibrateCSS('assets/css/core/style.css');
try { calibrateCSS('assets/css/core/cyber_theme.css'); } catch(e) {}
try { calibrateCSS('assets/css/features/identity.css'); } catch(e) {}
try { calibrateCSS('assets/css/features/intense_pack.css'); } catch(e) {}

