/**
 * Premium Biometric Authentication & Cryptographic Idle Stream
 * Elite Cybersecurity OS Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAuthHover, 2000);

    function initAuthHover() {
        const h1 = document.getElementById('typing-text');
        if (!h1) return;
        
        // --- 1. SET UP THE DOM STRUCTURE ---
        const originalText = "ANURAG PAREEK";
        h1.innerHTML = '';
        
        function generateSVGLayer(tokenCount, baseColor, minSize, maxSize) {
            let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">`;
            const tokens = ["0101", "1101", "0x7FA2", "SHA256", "AES", "TLS", "3FA8", "2001::", "<>", "::"];
            for(let i=0; i<tokenCount; i++) {
                const x = Math.random() * 400;
                const y = Math.random() * 800;
                const size = minSize + Math.random() * (maxSize - minSize);
                const text = tokens[Math.floor(Math.random() * tokens.length)];
                svg += `<text x="${x}" y="${y}" fill="${baseColor}" font-family="monospace" font-size="${size}">${text}</text>`;
            }
            svg += `</svg>`;
            return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
        }

        const layer1 = generateSVGLayer(40, 'rgba(0, 255, 65, 0.2)', 10, 12);
        const layer2 = generateSVGLayer(30, 'rgba(0, 255, 65, 0.4)', 14, 16);
        const layer3 = generateSVGLayer(20, '#00FF41', 18, 22);
        
        // --- 2. SET UP THE TEXT SPANS ---
        const spanArray = [];
        const chars = originalText.split('');
        
        chars.forEach(char => {
            if (char === ' ') {
                h1.appendChild(document.createTextNode(' '));
                spanArray.push(null);
            } else {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.display = 'inline-block';
                span.style.position = 'relative';
                span.style.transition = 'color 0.25s cubic-bezier(0.22,1,0.36,1), -webkit-text-stroke 0.25s cubic-bezier(0.22,1,0.36,1), text-shadow 0.25s cubic-bezier(0.22,1,0.36,1)';
                h1.appendChild(span);
                
                const rect = span.getBoundingClientRect();
                span.style.width = rect.width + 'px';
                span.style.textAlign = 'center';

                spanArray.push({
                    el: span,
                    orig: char,
                    glyphs: generateGlyphSequence(char)
                });
            }
        });

        // Restore blinking cursor
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        h1.appendChild(cursor);

        // --- 3. PRE-CREATE HOVER ANIMATION NODES ---
        const hexNodes = [];
        for(let i=0; i<4; i++) {
            const hex = document.createElement('div');
            hex.className = 'auth-hex';
            h1.appendChild(hex);
            hexNodes.push(hex);
        }

        const particles = [];
        for(let i=0; i<8; i++) {
            const p = document.createElement('div');
            p.className = 'auth-particle';
            h1.appendChild(p);
            particles.push(p);
        }

        const scanline = document.createElement('div');
        scanline.className = 'auth-scanline';
        h1.appendChild(scanline);

        // --- 4. INJECT STYLES ---
        const style = document.createElement('style');
        style.textContent = `
            /* SVG Background masking eliminates the black box entirely! */
            #typing-text.crypto-idle {
                background-image: 
                    var(--heartbeat-layer, linear-gradient(transparent, transparent)),
                    ${layer3}, 
                    ${layer2}, 
                    ${layer1}, 
                    linear-gradient(#050505, #050505) !important;
                background-size: 
                    100% 100%, 
                    400px 800px, 
                    300px 600px, 
                    200px 400px, 
                    100% 100% !important;
                -webkit-background-clip: text !important;
                background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                color: transparent !important;
                animation: crypto-scroll-bg 15s linear infinite !important;
                transition: background-color 0s, color 0s;
            }
            #typing-text.crypto-idle span {
                -webkit-text-fill-color: transparent !important;
                color: transparent !important;
            }
            @keyframes crypto-scroll-bg {
                0% { background-position: center center, 0 0, 0 0, 0 0, 0 0; }
                100% { background-position: center center, 0 -800px, 0 -600px, 0 -400px, 0 0; }
            }
            
            #typing-text.crypto-hovered {
                position: relative;
                z-index: 2;
                background: transparent !important;
                color: var(--text-color) !important;
                -webkit-text-fill-color: var(--text-color) !important;
            }

            /* Auth Hover Nodes */
            .auth-hex {
                position: absolute; color: rgba(0, 210, 255, 0.6);
                font-family: 'SF Mono', 'IBM Plex Mono', monospace; font-size: 10px;
                pointer-events: none; z-index: 10; opacity: 0; transition: opacity 0.12s ease;
            }
            .auth-particle {
                position: absolute; background: #fff; width: 1.5px; height: 1.5px; border-radius: 50%;
                opacity: 0; pointer-events: none; z-index: 10; box-shadow: 0 0 4px #00d2ff;
            }
            .auth-scanline {
                position: absolute; left: -5%; width: 110%; height: 1px;
                background: rgba(0, 210, 255, 0.5); box-shadow: 0 0 10px rgba(0, 210, 255, 0.8);
                opacity: 0; pointer-events: none; z-index: 11; will-change: transform, opacity;
            }
            .auth-outline {
                -webkit-text-fill-color: transparent !important; color: transparent !important;
                -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4) !important;
                text-shadow: 0 0 8px rgba(255,255,255,0.05) !important;
            }
            .auth-solid-sweep {
                -webkit-text-fill-color: #00d2ff !important; color: #00d2ff !important;
                -webkit-text-stroke: 0px !important; text-shadow: 0 0 12px rgba(0,210,255,0.6) !important;
            }
        `;
        document.head.appendChild(style);
        
        // Initialize Idle State
        h1.classList.add('crypto-idle');

        // --- 5. MICRO EFFECTS TIMERS (IDLE) ---
        
        // Heartbeat
        const hbSvgBase = \`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200"><text x="400" y="100" fill="#66D9FF" font-family="monospace" font-size="32" font-weight="bold" text-anchor="middle">\`;
        const heartbeats = ["IDENTITY VERIFIED", "AUTHENTICATED", "PUBLIC KEY VALID", "SIGNATURE VERIFIED"];
        setInterval(() => {
            if (isHovered) return;
            const text = heartbeats[Math.floor(Math.random() * heartbeats.length)];
            const hbUrl = \`url('data:image/svg+xml;utf8,\${encodeURIComponent(hbSvgBase + text + "</text></svg>")}')\`;
            h1.style.setProperty('--heartbeat-layer', hbUrl);
            setTimeout(() => {
                h1.style.removeProperty('--heartbeat-layer');
            }, 300);
        }, 9000); // ~9s

        // --- 6. HOVER ANIMATION LOGIC ---
        function generateGlyphSequence(origChar) {
            const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
            const sequence = [];
            const count = 3 + Math.floor(Math.random() * 3); // 3 to 5 glyphs
            for (let i=0; i<count; i++) {
                sequence.push(charset[Math.floor(Math.random() * charset.length)]);
            }
            sequence.push(origChar); 
            return sequence;
        }

        const validHexText = ["0x7FA2", "0xA91B", "AES", "SHA256", "AUTH", "0x00"];
        let isHovered = false;
        let isAnimating = false;
        let reqId;

        h1.addEventListener('mouseenter', () => {
            isHovered = true;
            
            // Swap to Hover State
            h1.classList.remove('crypto-idle');
            h1.classList.add('crypto-hovered');

            if (isAnimating) return;
            isAnimating = true;

            let startTime = performance.now();
            
            // 1. Position and trigger Hex nodes
            hexNodes.forEach(hex => {
                hex.textContent = validHexText[Math.floor(Math.random() * validHexText.length)];
                hex.style.left = (Math.random() * 100) + '%';
                hex.style.top = (Math.random() * 120 - 10) + '%';
                hex.style.opacity = '1';
                setTimeout(() => hex.style.opacity = '0', 120);
            });

            // 2. Prepare Scanline (0-150ms)
            scanline.style.opacity = '1';
            const h1Height = h1.offsetHeight;
            
            // 3. Prepare Particles
            particles.forEach(p => {
                p.style.transition = 'none';
                p.style.opacity = '1';
                p.style.left = (20 + Math.random() * 60) + '%';
                p.style.top = '50%';
                p.style.transform = 'translate(0, 0)';
            });
            void particles[0].offsetWidth; // reflow
            
            particles.forEach(p => {
                p.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease';
                const vx = (Math.random() - 0.5) * 60;
                const vy = (Math.random() * -40) - 10;
                p.style.transform = `translate(${vx}px, ${vy}px)`;
                p.style.opacity = '0';
            });

            // Reset text spans
            spanArray.forEach(item => {
                if (item) {
                    item.el.classList.remove('auth-outline', 'auth-solid-sweep');
                    item.glyphs = generateGlyphSequence(item.orig);
                }
            });

            function animate(now) {
                const elapsed = now - startTime;

                if (elapsed <= 150) {
                    scanline.style.transform = `translateY(${(elapsed / 150) * h1Height}px)`;
                } else if (elapsed > 150 && elapsed < 200) {
                    scanline.style.opacity = '0';
                }

                if (elapsed > 150 && elapsed <= 500) {
                    spanArray.forEach((item, index) => {
                        if (!item) return;
                        const charElapsed = elapsed - (150 + (index * 20));
                        if (charElapsed > 0) {
                            let glyphIndex = Math.floor((charElapsed / 200) * item.glyphs.length);
                            if (glyphIndex >= item.glyphs.length) glyphIndex = item.glyphs.length - 1;
                            item.el.textContent = item.glyphs[glyphIndex];
                        }
                    });
                }

                if (elapsed > 500 && elapsed <= 800) {
                    spanArray.forEach(item => {
                        if (item && item.el.textContent !== item.orig) item.el.textContent = item.orig;
                        if (item && !item.el.classList.contains('auth-outline')) item.el.classList.add('auth-outline');
                    });
                    
                    const activeIndex = Math.floor(((elapsed - 500) / 300) * spanArray.length * 1.5);
                    spanArray.forEach((item, index) => {
                        if (!item) return;
                        if (index === activeIndex || index === activeIndex - 1) {
                            item.el.classList.add('auth-solid-sweep');
                        } else {
                            item.el.classList.remove('auth-solid-sweep');
                        }
                    });
                }

                if (elapsed > 800) {
                    spanArray.forEach(item => { if (item) item.el.classList.remove('auth-solid-sweep'); });
                    isAnimating = false;
                    if (!isHovered) reverseAnimation();
                    return;
                }

                reqId = requestAnimationFrame(animate);
            }
            
            reqId = requestAnimationFrame(animate);
        });

        h1.addEventListener('mouseleave', () => {
            isHovered = false;
            if (!isAnimating) reverseAnimation();
        });
        
        function reverseAnimation() {
            spanArray.forEach(item => {
                if (item) {
                    item.el.classList.remove('auth-outline', 'auth-solid-sweep');
                    item.el.textContent = item.orig;
                }
            });
            scanline.style.opacity = '0';
            
            // Smoothly restore Idle State
            h1.classList.remove('crypto-hovered');
            h1.classList.add('crypto-idle');
        }
    }
});
