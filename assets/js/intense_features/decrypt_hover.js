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
                position: relative; /* CRUCIAL for canvas positioning */
                z-index: 2;
                background: transparent !important;
                background-clip: border-box !important;
                -webkit-background-clip: border-box !important;
                -webkit-text-fill-color: currentcolor !important;
            }
            #typing-text.crypto-idle span {
                opacity: 0 !important; /* Hide HTML text during idle, canvas takes over */
            }
            #typing-text.crypto-hovered {
                position: relative;
                z-index: 2;
                background: transparent !important;
                background-clip: border-box !important;
                -webkit-background-clip: border-box !important;
                color: var(--text-color) !important;
                -webkit-text-fill-color: var(--text-color) !important;
            }

            .crypto-canvas {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                opacity: 1;
                transition: opacity 0.2s;
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

        // --- 5. CANVAS MATRIX IDLE ANIMATION ---
        const canvas = document.createElement('canvas');
        canvas.className = 'crypto-canvas';
        h1.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let cw, ch;
        function resizeCanvas() {
            const rect = h1.getBoundingClientRect();
            // Need high-res for sharp text
            const dpr = window.devicePixelRatio || 1;
            cw = rect.width;
            ch = rect.height;
            canvas.width = cw * dpr;
            canvas.height = ch * dpr;
            ctx.scale(dpr, dpr);
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const dataTokens = ["01011010", "0x7FA2", "0xAB91", "SHA256", "AES", "TLS", "3FA8", "2001::", "<>", "::"];
        const streams = [];
        for(let i=0; i<40; i++) {
            streams.push({
                x: Math.random(), // percentage
                y: Math.random() * 200, 
                speed: 15 + Math.random() * 25, 
                text: dataTokens[Math.floor(Math.random() * dataTokens.length)],
                opacity: 0.3 + Math.random() * 0.7,
                size: 10 + Math.random() * 12
            });
        }

        let heartbeatText = "";
        const heartbeats = ["IDENTITY VERIFIED", "AUTHENTICATED", "PUBLIC KEY VALID", "SIGNATURE VERIFIED"];
        setInterval(() => {
            if (isHovered) return;
            heartbeatText = heartbeats[Math.floor(Math.random() * heartbeats.length)];
            setTimeout(() => heartbeatText = "", 300);
        }, 9000);

        function drawIdle() {
            if (!isHovered) {
                ctx.clearRect(0, 0, cw, ch);
                
                // 1. Draw solid silver base for the text letters
                ctx.fillStyle = '#F5F5F5';
                ctx.fillRect(0, 0, cw, ch);

                // 2. Draw matrix rain
                streams.forEach(s => {
                    ctx.fillStyle = `rgba(0, 255, 65, ${s.opacity})`;
                    ctx.font = `${s.size}px "IBM Plex Mono", monospace`;
                    ctx.fillText(s.text, s.x * cw, s.y);
                    s.y -= s.speed * 0.016; // Move up
                    if (s.y < -20) {
                        s.y = ch + 20;
                        s.x = Math.random();
                        s.text = dataTokens[Math.floor(Math.random() * dataTokens.length)];
                    }
                });

                // 3. Draw Heartbeat
                if (heartbeatText) {
                    ctx.fillStyle = '#66D9FF';
                    ctx.font = 'bold 32px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(heartbeatText, cw/2, ch/2);
                    ctx.textAlign = 'left'; // reset
                    ctx.textBaseline = 'alphabetic';
                }

                // 4. MASK THE ENTIRE CANVAS TO THE HTML TEXT
                ctx.globalCompositeOperation = 'destination-in';
                const computedStyle = window.getComputedStyle(h1);
                ctx.font = `700 ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
                ctx.textBaseline = 'top';
                ctx.fillStyle = 'white'; // Any solid color acts as the mask
                
                spanArray.forEach(item => {
                    if (item && item.orig !== ' ') {
                        // offsetLeft/Top perfectly align with the span's position within h1!
                        ctx.fillText(item.orig, item.el.offsetLeft, item.el.offsetTop);
                    }
                });
                
                ctx.globalCompositeOperation = 'source-over';
            }
            requestAnimationFrame(drawIdle);
        }
        requestAnimationFrame(drawIdle);

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
            canvas.style.opacity = '0';
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
                    item.el.style.opacity = '1'; // Show span during hover!
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
                    item.el.style.opacity = ''; // Let CSS take over (it will be 0 in crypto-idle)
                }
            });
            scanline.style.opacity = '0';
            
            // Smoothly restore Idle State
            h1.classList.remove('crypto-hovered');
            h1.classList.add('crypto-idle');
            setTimeout(() => {
                if (!isHovered) canvas.style.opacity = '1';
            }, 100);
        }
    }
});
