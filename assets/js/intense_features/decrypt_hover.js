/**
 * Premium Biometric Authentication Hover Interaction
 * Elite Cybersecurity OS Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for initial typing animation to finish
    setTimeout(initAuthHover, 2000);

    function initAuthHover() {
        const h1 = document.getElementById('typing-text');
        if (!h1) return;
        
        const originalText = "ANURAG PAREEK";
        h1.innerHTML = '';
        h1.style.position = 'relative';
        
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
                // Set transition for smooth color changes during sweep and outline
                span.style.transition = 'color 0.25s cubic-bezier(0.22,1,0.36,1), -webkit-text-stroke 0.25s cubic-bezier(0.22,1,0.36,1), text-shadow 0.25s cubic-bezier(0.22,1,0.36,1)';
                h1.appendChild(span);
                
                // Lock width to prevent layout shifts during random glyphs
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

        // Restore the typing cursor so it continues to blink at the end
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        h1.appendChild(cursor);

        // Pre-create DOM nodes to avoid layout thrashing during animation
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

        // Inject Styles
        const style = document.createElement('style');
        style.textContent = `
            .auth-hex {
                position: absolute;
                color: rgba(0, 210, 255, 0.6);
                font-family: 'SF Mono', 'IBM Plex Mono', monospace;
                font-size: 10px;
                letter-spacing: 0;
                pointer-events: none;
                z-index: 10;
                opacity: 0;
                transition: opacity 0.12s ease;
            }
            .auth-particle {
                position: absolute;
                background: #fff;
                width: 1.5px;
                height: 1.5px;
                border-radius: 50%;
                opacity: 0;
                pointer-events: none;
                z-index: 10;
                box-shadow: 0 0 4px #00d2ff;
            }
            .auth-scanline {
                position: absolute;
                left: -5%;
                width: 110%;
                height: 1px;
                background: rgba(0, 210, 255, 0.5);
                box-shadow: 0 0 10px rgba(0, 210, 255, 0.8);
                opacity: 0;
                pointer-events: none;
                z-index: 11;
                will-change: transform, opacity;
            }
            .auth-outline {
                -webkit-text-fill-color: transparent !important;
                color: transparent !important;
                -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4) !important;
                text-shadow: 0 0 8px rgba(255,255,255,0.05) !important;
            }
            .auth-solid-sweep {
                -webkit-text-fill-color: #00d2ff !important;
                color: #00d2ff !important;
                -webkit-text-stroke: 0px !important;
                text-shadow: 0 0 12px rgba(0,210,255,0.6) !important;
            }
        `;
        document.head.appendChild(style);

        function generateGlyphSequence(origChar) {
            const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
            const sequence = [];
            const count = 3 + Math.floor(Math.random() * 3); // 3 to 5 glyphs
            for (let i=0; i<count; i++) {
                sequence.push(charset[Math.floor(Math.random() * charset.length)]);
            }
            sequence.push(origChar); // Ensure it ends with original
            return sequence;
        }

        const validHexText = ["0x7FA2", "0xA91B", "AES", "SHA256", "AUTH", "0x00"];

        let isHovered = false;
        let isAnimating = false;
        let reqId;

        h1.addEventListener('mouseenter', () => {
            isHovered = true;
            if (isAnimating) return;
            isAnimating = true;

            let startTime = performance.now();
            
            // 1. Position and trigger Hex nodes (Max 4)
            hexNodes.forEach(hex => {
                hex.textContent = validHexText[Math.floor(Math.random() * validHexText.length)];
                hex.style.left = (Math.random() * 100) + '%';
                hex.style.top = (Math.random() * 120 - 10) + '%';
                hex.style.opacity = '1';
                
                setTimeout(() => {
                    hex.style.opacity = '0';
                }, 120);
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
            // Force reflow
            void particles[0].offsetWidth;
            
            particles.forEach(p => {
                p.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease';
                const vx = (Math.random() - 0.5) * 60;
                const vy = (Math.random() * -40) - 10; // always up
                p.style.transform = `translate(${vx}px, ${vy}px)`;
                p.style.opacity = '0';
            });

            // Reset text spans
            spanArray.forEach(item => {
                if (item) {
                    item.el.classList.remove('auth-outline', 'auth-solid-sweep');
                    // Regenerate sequence for this run
                    item.glyphs = generateGlyphSequence(item.orig);
                }
            });

            function animate(now) {
                const elapsed = now - startTime;

                // Scanline logic (0-150ms)
                if (elapsed <= 150) {
                    const progress = elapsed / 150;
                    scanline.style.transform = `translateY(${progress * h1Height}px)`;
                } else if (elapsed > 150 && elapsed < 200) {
                    scanline.style.opacity = '0';
                }

                // Stage 2: Glyph cycling (150-500ms)
                // Each character starts 20ms after the previous
                if (elapsed > 150 && elapsed <= 500) {
                    spanArray.forEach((item, index) => {
                        if (!item) return;
                        
                        const charStartTime = 150 + (index * 20);
                        const charElapsed = elapsed - charStartTime;
                        
                        if (charElapsed > 0) {
                            // Cycle through the sequence over 200ms
                            const totalCharTime = 200;
                            let glyphIndex = Math.floor((charElapsed / totalCharTime) * item.glyphs.length);
                            
                            if (glyphIndex >= item.glyphs.length) {
                                glyphIndex = item.glyphs.length - 1;
                            }
                            
                            item.el.textContent = item.glyphs[glyphIndex];
                        }
                    });
                }

                // Stage 3: Outline & Sweep (500-700ms)
                if (elapsed > 500 && elapsed <= 800) {
                    // Make sure all glyphs are finalized
                    spanArray.forEach(item => {
                        if (item && item.el.textContent !== item.orig) {
                            item.el.textContent = item.orig;
                        }
                        if (item && !item.el.classList.contains('auth-outline')) {
                            item.el.classList.add('auth-outline');
                        }
                    });
                    
                    const sweepProgress = (elapsed - 500) / 300;
                    const activeIndex = Math.floor(sweepProgress * spanArray.length * 1.5);
                    
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
                    // Animation complete
                    spanArray.forEach(item => {
                        if (item) item.el.classList.remove('auth-solid-sweep');
                    });
                    isAnimating = false;
                    
                    if (!isHovered) {
                        reverseAnimation();
                    }
                    return;
                }

                reqId = requestAnimationFrame(animate);
            }
            
            reqId = requestAnimationFrame(animate);
        });

        h1.addEventListener('mouseleave', () => {
            isHovered = false;
            if (!isAnimating) {
                reverseAnimation();
            }
        });
        
        function reverseAnimation() {
            // Reverses smoothly in 250ms via CSS transitions
            spanArray.forEach(item => {
                if (item) {
                    item.el.classList.remove('auth-outline', 'auth-solid-sweep');
                    item.el.textContent = item.orig;
                }
            });
            scanline.style.opacity = '0';
        }
    }
});
