/* ==========================================================================
   PREMIUM CYBER IDENTITY AUTHENTICATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    const oldTypingText = document.getElementById('typing-text');
    if (!oldTypingText) return;

    // Remove the old typing element and replace with Identity Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-identity-wrapper';
    wrapper.id = 'hero-identity';
    
    wrapper.innerHTML = `
        <div class="id-coord-label id-coord-1">x:438 y:214</div>
        <div class="id-coord-label id-coord-2">ID:AP-001</div>
        <div class="identity-name-container">
            <span class="id-bracket left">[</span>
            <div id="id-name-chars" style="display:flex; position:relative;">
                <div class="id-scan-line"></div>
            </div>
            <span class="id-bracket right">]</span>
        </div>
        <div class="id-auth-labels" id="id-auth-labels"></div>
        <div class="id-particles" id="id-particles"></div>
        <div class="id-status-module">
            <span class="id-status-dot"></span>
            <span class="id-status-text" id="id-status-text">AUTHENTICATED</span>
        </div>
    `;

    heroContent.replaceChild(wrapper, oldTypingText);

    const nameStr = "ANURAG PAREEK";
    const charsContainer = document.getElementById('id-name-chars');
    const scanLine = wrapper.querySelector('.id-scan-line');
    const statusText = document.getElementById('id-status-text');
    const authLabelsContainer = document.getElementById('id-auth-labels');
    const particlesContainer = document.getElementById('id-particles');

    // Split letters
    const charElements = [];
    for (let i = 0; i < nameStr.length; i++) {
        const char = nameStr[i];
        if (char === ' ') {
            const space = document.createElement('span');
            space.style.width = '1rem';
            charsContainer.appendChild(space);
        } else {
            const span = document.createElement('span');
            span.className = 'id-char';
            span.textContent = char;
            charsContainer.appendChild(span);
            charElements.push(span);
        }
    }

    // Prefers Reduced Motion Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================================
       IDLE SCAN (Every 8-10s)
       ========================================================================== */
    let scanInterval;
    function runIdleScan() {
        if (prefersReducedMotion || isHovering) return;
        
        scanLine.style.transition = 'none';
        scanLine.style.transform = 'translateX(-20px)';
        scanLine.style.opacity = '1';
        
        // Force reflow
        void scanLine.offsetWidth;

        scanLine.style.transition = 'transform 600ms linear, opacity 200ms ease';
        scanLine.style.transform = `translateX(${charsContainer.offsetWidth + 20}px)`;

        // Highlight letters as scan passes
        const totalTime = 600;
        charElements.forEach((el, index) => {
            const delay = (index / charElements.length) * totalTime;
            setTimeout(() => {
                if (isHovering) return;
                el.style.color = '#fff';
                el.style.textShadow = '0 0 10px #00d2ff, 0 0 20px #00d2ff';
                
                setTimeout(() => {
                    if (isHovering) return;
                    el.style.color = '';
                    el.style.textShadow = '';
                }, 300);
            }, delay);
        });

        setTimeout(() => {
            scanLine.style.opacity = '0';
        }, 600);
    }
    
    if (!prefersReducedMotion) {
        scanInterval = setInterval(runIdleScan, 9000);
        setTimeout(runIdleScan, 2000);
    }

    /* ==========================================================================
       STATUS MODULE CYCLE
       ========================================================================== */
    const statuses = [
        "AUTHENTICATED", 
        "SIGNATURE VERIFIED", 
        "SECURE SESSION", 
        "ENCRYPTION ENABLED", 
        "TRUST ESTABLISHED"
    ];
    let statusIndex = 0;
    
    function cycleStatus() {
        if (isHovering || isDetecting) return;
        statusIndex = (statusIndex + 1) % statuses.length;
        updateStatus(statuses[statusIndex]);
    }
    setInterval(cycleStatus, 6000);

    function updateStatus(text) {
        statusText.style.opacity = '0';
        setTimeout(() => {
            statusText.textContent = text;
            statusText.style.opacity = '1';
        }, 300);
    }

    /* ==========================================================================
       PROXIMITY & HOVER EFFECTS
       ========================================================================== */
    let isDetecting = false;
    let isHovering = false;
    let authTimeout;

    // Subtle magnetism
    document.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;
        
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 200 && !isHovering) {
            if (!isDetecting) {
                isDetecting = true;
                wrapper.classList.add('detecting');
                updateStatus("DETECTING...");
            }
            // Magnetism (Max 4px, Max 2deg)
            const moveX = (distX / 200) * 4;
            const moveY = (distY / 200) * 4;
            const tiltX = -(distY / 200) * 2;
            const tiltY = (distX / 200) * 2;
            wrapper.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        } else {
            if (isDetecting && !isHovering) {
                isDetecting = false;
                wrapper.classList.remove('detecting');
                updateStatus(statuses[statusIndex]);
            }
            if (!isHovering) {
                wrapper.style.transform = 'translate(0, 0) rotateX(0) rotateY(0)';
            }
        }
    });

    wrapper.addEventListener('mouseenter', () => {
        if (prefersReducedMotion) return;
        isHovering = true;
        isDetecting = false;
        wrapper.classList.remove('detecting');
        wrapper.classList.add('hovering');
        
        // Stage 1: Detection
        updateStatus("IDENTITY DETECTED");
        
        // Stage 2: Authentication
        authTimeout = setTimeout(() => {
            triggerAuthentication();
        }, 350);
    });

    wrapper.addEventListener('mouseleave', () => {
        if (prefersReducedMotion) return;
        isHovering = false;
        clearTimeout(authTimeout);
        wrapper.classList.remove('hovering');
        wrapper.classList.remove('verified');
        
        // Cleanup labels & particles
        authLabelsContainer.innerHTML = '';
        particlesContainer.innerHTML = '';
        charElements.forEach(el => {
            el.style.color = '';
            el.style.textShadow = '';
        });
        wrapper.style.transform = 'translate(0, 0) rotateX(0) rotateY(0)';

        // Hover Exit Sequence
        updateStatus("SESSION ACTIVE");
        setTimeout(() => { if (!isHovering && !isDetecting) updateStatus("SECURE SESSION"); }, 1500);
        setTimeout(() => { if (!isHovering && !isDetecting) updateStatus("AUTHENTICATED"); }, 3000);
    });

    function triggerAuthentication() {
        if (!isHovering) return;
        
        // Flash auth labels
        const labels = ['SHA-256', 'ECDSA', 'RSA', 'TLS', 'AES-256', 'PUBLIC KEY', 'CERTIFICATE', 'VERIFIED'];
        authLabelsContainer.innerHTML = '';
        
        const numLabels = Math.min(5, labels.length);
        const shuffled = labels.sort(() => 0.5 - Math.random()).slice(0, numLabels);
        
        shuffled.forEach((text, i) => {
            const label = document.createElement('div');
            label.className = 'id-auth-label';
            label.textContent = text;
            
            // Random positioning around the text
            const angle = (i / numLabels) * Math.PI * 2;
            const radius = 60 + Math.random() * 40;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            label.style.transform = `translate(${x}px, ${y}px) scale(0.9)`;
            authLabelsContainer.appendChild(label);
            
            setTimeout(() => {
                label.style.opacity = '1';
                label.style.color = '#00ff66';
                label.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            }, i * 50);
        });

        // Stage 3: Verification
        setTimeout(() => {
            if (!isHovering) return;
            wrapper.classList.add('verified');
            updateStatus("IDENTITY VERIFIED ✓");
            authLabelsContainer.innerHTML = ''; // Clear labels
            
            // Emit particles
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'id-particle';
                const pX = (Math.random() - 0.5) * 100;
                const pY = (Math.random() - 0.5) * 50 - 20;
                
                particlesContainer.appendChild(particle);
                
                // Trigger reflow
                void particle.offsetWidth;
                
                particle.style.opacity = '1';
                particle.style.transform = `translate(${pX}px, ${pY}px)`;
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                }, 300);
            }
        }, 350);
    }
});
