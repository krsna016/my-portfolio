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
        
        // Create an isolation wrapper to contain the mix-blend-mode
        const wrapper = document.createElement('div');
        wrapper.className = 'crypto-wrapper';
        h1.parentNode.insertBefore(wrapper, h1);
        
        // Create the data stream container
        const stream = document.createElement('div');
        stream.className = 'crypto-stream';
        
        // Generate continuous stream content
        const dataTokens = [
            "01011010", "11010101", "0x7FA2", "0xAB91", "SHA256", "SHA3", 
            "BLAKE3", "AES", "AES-256", "RSA", "ECC", "TLS1.3", "JWT", 
            "3FA85F64", "2001:db8::", "0x00007FFE", "A7 F2 8C 19", "<>", "{}", "[]", "::"
        ];
        
        function genContent(lines, withHeartbeat = false) {
            let html = '';
            for(let i=0; i<lines; i++) {
                if (withHeartbeat && i === Math.floor(lines/2)) {
                    html += `<div class="crypto-heartbeat" style="white-space:nowrap; overflow:hidden;">0x7FA2 AES-256</div>`;
                } else {
                    html += `<div style="white-space:nowrap; overflow:hidden;">${dataTokens[Math.floor(Math.random()*dataTokens.length)]} ${dataTokens[Math.floor(Math.random()*dataTokens.length)]} ${dataTokens[Math.floor(Math.random()*dataTokens.length)]}</div>`;
                }
            }
            return html + html; // duplicate for infinite scroll
        }

        stream.innerHTML = `
            <div class="crypto-layer crypto-layer-1">${genContent(40)}</div>
            <div class="crypto-layer crypto-layer-2">${genContent(30, true)}</div>
            <div class="crypto-layer crypto-layer-3">${genContent(20)}</div>
            <div class="crypto-light-pass"></div>
        `;
        
        wrapper.appendChild(stream);
        wrapper.appendChild(h1);
        
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
            .crypto-wrapper {
                position: relative;
                display: inline-block;
                isolation: isolate; /* Create new stacking context for multiply */
            }
            .crypto-stream {
                position: absolute;
                inset: 0;
                background: #F5F5F5; /* White background for the window */
                overflow: hidden;
                z-index: 1;
                opacity: 1;
                transition: opacity 0.15s ease;
                font-family: 'SF Mono', 'IBM Plex Mono', monospace;
                line-height: 1.5;
                pointer-events: none;
            }
            .crypto-layer {
                position: absolute;
                top: 0; left: 0; width: 100%;
                display: flex;
                flex-direction: column;
                will-change: transform;
            }
            .crypto-layer-1 {
                color: #D0D0D0;
                font-size: 10px;
                opacity: 0.15;
                animation: crypto-move 35s linear infinite;
            }
            .crypto-layer-2 {
                color: #C0C0C0;
                font-size: 14px;
                opacity: 0.4;
                animation: crypto-move 25s linear infinite;
                margin-left: 10%;
            }
            .crypto-layer-3 {
                color: #66D9FF;
                font-size: 18px;
                opacity: 0.6;
                filter: blur(0.5px);
                animation: crypto-move 18s linear infinite;
                margin-left: 20%;
            }
            @keyframes crypto-move {
                0% { transform: translateY(0); }
                100% { transform: translateY(-50%); }
            }
            .crypto-light-pass {
                position: absolute;
                top: -10%; bottom: -10%;
                width: 40px;
                background: rgba(255, 255, 255, 0.8);
                box-shadow: 0 0 40px 30px rgba(255, 255, 255, 0.6);
                transform: translateX(-150px) skewX(-15deg);
                opacity: 0;
                transition: transform 0.6s linear, opacity 0.2s;
                will-change: transform;
            }
            
            /* Apply mix-blend-mode to H1 to act as mask */
            #typing-text.crypto-idle {
                position: relative;
                z-index: 2;
                color: #FFFFFF !important;
                mix-blend-mode: multiply;
                background-color: #060606 !important;
                background-image: 
                    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px) !important;
                background-size: 100px 100px !important;
                background-position: center center !important;
                background-attachment: fixed !important;
                transition: background-color 0s, color 0s;
            }
            
            #typing-text.crypto-hovered {
                position: relative;
                z-index: 2;
                mix-blend-mode: normal;
                background: transparent !important;
                color: var(--text-color) !important;
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
        const heartbeats = ["IDENTITY VERIFIED", "AUTHENTICATED", "PUBLIC KEY VALID", "SIGNATURE VERIFIED"];
        setInterval(() => {
            if (isHovered) return;
            const hbs = document.querySelectorAll('.crypto-heartbeat');
            hbs.forEach(hb => {
                const old = hb.textContent;
                hb.textContent = heartbeats[Math.floor(Math.random() * heartbeats.length)];
                hb.style.color = '#66D9FF';
                hb.style.fontWeight = 'bold';
                setTimeout(() => {
                    hb.textContent = old;
                    hb.style.color = '';
                    hb.style.fontWeight = 'normal';
                }, 300);
            });
        }, 9000); // ~9s

        // Light Pass
        const lightPass = stream.querySelector('.crypto-light-pass');
        setInterval(() => {
            if (isHovered) return;
            const wrapperRect = wrapper.getBoundingClientRect();
            lightPass.style.transition = 'none';
            lightPass.style.opacity = '1';
            lightPass.style.transform = `translateX(-100px) skewX(-15deg)`;
            
            // Force reflow
            void lightPass.offsetWidth;
            
            lightPass.style.transition = 'transform 0.5s linear, opacity 0.2s';
            lightPass.style.transform = `translateX(${wrapperRect.width + 100}px) skewX(-15deg)`;
            
            setTimeout(() => {
                lightPass.style.opacity = '0';
            }, 450);
        }, 10000); // 10s

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
            stream.style.opacity = '0';
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
            setTimeout(() => {
                if (!isHovered) stream.style.opacity = '1';
            }, 100); // small delay to match CSS transitions
        }
    }
});
