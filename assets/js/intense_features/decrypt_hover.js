/**
 * Ultra-Premium Decrypt Hover Interaction
 * Elite Cybersecurity OS Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    // We wait slightly longer to let the initial typing animation of "Anurag Pareek" complete
    setTimeout(initDecryptHover, 2000);

    function initDecryptHover() {
        const h1 = document.getElementById('typing-text');
        if (!h1) return;
        
        // Remove typing cursor and set static text to take full control
        const originalText = "ANURAG PAREEK";
        h1.innerHTML = '';
        
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
                span.style.transition = 'color 0.1s, -webkit-text-stroke 0.1s, text-shadow 0.1s';
                h1.appendChild(span);
                spanArray.push({
                    el: span,
                    orig: char
                });
            }
        });

        // Inject styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes crt-flicker {
                0% { opacity: 0.9; }
                5% { opacity: 0.5; }
                10% { opacity: 1; }
                15% { opacity: 0.8; }
                20% { opacity: 1; }
                100% { opacity: 1; }
            }
            .decrypt-active {
                animation: crt-flicker 0.15s linear infinite;
            }
            .decrypt-stage1 {
                text-shadow: 4px 0 0 rgba(255,0,0,0.8), -4px 0 0 rgba(0,255,255,0.8) !important;
                filter: contrast(150%) brightness(120%) !important;
                transform: skewX(-3deg) !important;
            }
            .decrypt-stage4 span {
                -webkit-text-fill-color: transparent !important;
                color: transparent !important;
                -webkit-text-stroke: 1px rgba(255,255,255,0.4) !important;
                text-shadow: 0 0 10px rgba(255,255,255,0.1) !important;
            }
            .decrypt-light-sweep {
                -webkit-text-fill-color: #00d2ff !important;
                color: #00d2ff !important;
                -webkit-text-stroke: 0px !important;
                text-shadow: 0 0 25px #00d2ff !important;
            }
            .decrypt-particle {
                position: absolute;
                background: #fff;
                width: 2px;
                height: 2px;
                border-radius: 50%;
                box-shadow: 0 0 6px #00d2ff;
                pointer-events: none;
                z-index: 9999;
            }
            .decrypt-hex {
                position: absolute;
                color: #00d2ff;
                font-family: monospace;
                font-size: 11px;
                font-weight: bold;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s ease;
                text-shadow: 0 0 8px #00d2ff;
                z-index: 9999;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);

        let isAnimating = false;
        let isHovered = false;
        let reqId;

        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/█▓▒";
        const hexes = ["0x9F2A", "SHA256", "AES-256", "RSA", "TLS", "ECDSA", "0x00FF", "HASH"];

        h1.addEventListener('mouseenter', () => {
            isHovered = true;
            if (isAnimating) return;
            isAnimating = true;

            // Reset text just in case
            spanArray.forEach(item => { if(item) item.el.textContent = item.orig; });

            // Stage 1 trigger
            h1.classList.add('decrypt-active', 'decrypt-stage1');
            spawnHexNodes(h1);
            playClick();

            let startTime = performance.now();
            
            function animate(now) {
                if (!isHovered && now - startTime > 1400) {
                    cleanup();
                    return;
                }

                const elapsed = now - startTime;

                if (elapsed < 200) {
                    // Stage 1: Freeze + RGB separate (handled by CSS .decrypt-stage1)
                } 
                else if (elapsed < 500) {
                    // Stage 2: Rapidly lose identity
                    h1.classList.remove('decrypt-stage1');
                    
                    spanArray.forEach(item => {
                        if (!item) return;
                        if (Math.random() > 0.4) {
                            if (Math.random() > 0.85) {
                                item.el.textContent = hexes[Math.floor(Math.random() * hexes.length)];
                                item.el.style.fontSize = "0.4em";
                            } else {
                                item.el.textContent = charset[Math.floor(Math.random() * charset.length)];
                                item.el.style.fontSize = "1em";
                            }
                        }
                    });
                } 
                else if (elapsed < 800) {
                    // Stage 3: Decrypting from left to right
                    const progress = (elapsed - 500) / 300; 
                    const resolveIndex = Math.floor(progress * spanArray.length);
                    
                    spanArray.forEach((item, idx) => {
                        if (!item) return;
                        if (idx <= resolveIndex) {
                            item.el.textContent = item.orig;
                            item.el.style.fontSize = "1em";
                        } else {
                            if (Math.random() > 0.5) {
                                item.el.textContent = charset[Math.floor(Math.random() * charset.length)];
                                item.el.style.fontSize = "1em";
                            }
                        }
                    });
                } 
                else if (elapsed < 1400) {
                    // Stage 4: Premium Reveal (Outline + Sweep)
                    if (!h1.classList.contains('decrypt-stage4')) {
                        h1.classList.remove('decrypt-active');
                        h1.classList.add('decrypt-stage4');
                        spanArray.forEach(item => { if(item) { item.el.textContent = item.orig; item.el.style.fontSize = "1em"; } });
                        playChirp();
                        spawnParticles(h1);
                    }
                    
                    const sweepProgress = (elapsed - 800) / 600; 
                    const sweepIndex = Math.floor(sweepProgress * spanArray.length * 1.5); 
                    
                    spanArray.forEach((item, idx) => {
                        if (!item) return;
                        if (idx === sweepIndex || idx === sweepIndex - 1) {
                            item.el.classList.add('decrypt-light-sweep');
                        } else {
                            item.el.classList.remove('decrypt-light-sweep');
                        }
                    });
                } 
                else {
                    // Stage 5: Hold final state
                    spanArray.forEach(item => { if (item) item.el.classList.remove('decrypt-light-sweep'); });
                    if (!isHovered) {
                        cleanup();
                        return;
                    }
                }
                
                reqId = requestAnimationFrame(animate);
            }
            
            reqId = requestAnimationFrame(animate);
        });

        function cleanup() {
            cancelAnimationFrame(reqId);
            h1.classList.remove('decrypt-active', 'decrypt-stage1', 'decrypt-stage4');
            spanArray.forEach(item => {
                if (item) {
                    item.el.textContent = item.orig;
                    item.el.style.fontSize = "1em";
                    item.el.classList.remove('decrypt-light-sweep');
                }
            });
            h1.style.transform = 'none';
            document.querySelectorAll('.decrypt-hex').forEach(n => n.remove());
            isAnimating = false;
        }

        h1.addEventListener('mouseleave', () => {
            isHovered = false;
            // If animation passed stage 4, clean up immediately. Otherwise let it finish cleanly.
            if (!isAnimating) cleanup();
        });
        
        // Magnet effect
        h1.addEventListener('mousemove', (e) => {
            if (!isAnimating && !isHovered) return;
            const rect = h1.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            const rotX = (y / rect.height) * -6; // max 3 deg
            const rotY = (x / rect.width) * 6;
            h1.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
        });
        
        function spawnHexNodes(parent) {
            for(let i=0; i<5; i++) {
                const hex = document.createElement('div');
                hex.className = 'decrypt-hex';
                hex.textContent = hexes[Math.floor(Math.random()*hexes.length)];
                hex.style.left = (Math.random() * 120 - 10) + '%';
                hex.style.top = (Math.random() * 120 - 10) + '%';
                parent.appendChild(hex);
                
                setTimeout(() => hex.style.opacity = '0.9', 10);
                setTimeout(() => hex.style.opacity = '0', 180 + Math.random()*50);
            }
        }
        
        function spawnParticles(parent) {
            for(let i=0; i<15; i++) {
                const p = document.createElement('div');
                p.className = 'decrypt-particle';
                p.style.left = (Math.random() * 100) + '%';
                p.style.top = '50%';
                parent.appendChild(p);
                
                const vx = (Math.random() - 0.5) * 120;
                const vy = (Math.random() - 0.5) * 120;
                
                p.animate([
                    { transform: 'translate(0,0)', opacity: 1 },
                    { transform: `translate(${vx}px, ${vy}px)`, opacity: 0 }
                ], { duration: 600 + Math.random()*400, easing: 'ease-out' });
                
                setTimeout(() => p.remove(), 1000);
            }
        }
        
        // Audio
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let actx = null;
        function getCtx() {
            if (!actx) actx = new AudioContext();
            // Resume context if suspended (browser auto-play policy)
            if (actx.state === 'suspended') actx.resume();
            return actx;
        }
        
        function playClick() {
            try {
                const ctx = getCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.015, ctx.currentTime); // very soft
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.05);
            } catch(e) {}
        }
        function playChirp() {
            try {
                const ctx = getCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(2000, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(3000, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.015, ctx.currentTime); // very soft
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } catch(e) {}
        }
    }
});
