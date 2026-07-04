/* ==========================================================================
   PREMIUM TERMINAL CONNECTION RAIL TIMELINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // The timeline might be dynamically injected by experience_data.js.
    // So we'll run a MutationObserver or a small timeout to find it.
    
    function initPremiumTimeline() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return false;
        
        const items = Array.from(timeline.querySelectorAll('.timeline-item'));
        if (items.length === 0) return false;

        // Ensure we only initialize once
        if (timeline.hasAttribute('data-premium-init')) return true;
        timeline.setAttribute('data-premium-init', 'true');
        
        // Create data packet
        const packet = document.createElement('div');
        packet.className = 'timeline-packet';
        timeline.appendChild(packet);
        
        // Check reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return true;
        
        function triggerPacket() {
            // Re-fetch items in case they changed
            const currentItems = Array.from(timeline.querySelectorAll('.timeline-item'));
            if (currentItems.length === 0) return;
            
            const startY = currentItems[0].offsetTop + 20; // top of first node roughly
            const endY = currentItems[currentItems.length - 1].offsetTop + 20; // top of last node roughly
            
            // Initial state
            packet.style.transition = 'none';
            packet.style.transform = `translate(-50%, ${startY}px)`;
            packet.style.opacity = '0';
            
            // Force reflow
            void packet.offsetWidth;
            
            // Animation
            const duration = currentItems.length * 1000; // 1 second per item distance roughly
            packet.style.transition = `transform ${duration}ms linear, opacity 300ms ease`;
            packet.style.opacity = '1';
            packet.style.transform = `translate(-50%, ${endY}px)`;
            
            // Pulse nodes as packet passes
            currentItems.forEach((item) => {
                const itemY = item.offsetTop + 20;
                const dist = itemY - startY;
                const totalDist = endY - startY;
                
                // If there's only 1 item, totalDist is 0. Avoid division by zero.
                if (totalDist <= 0) return;
                
                const timeToReach = (dist / totalDist) * duration;
                
                setTimeout(() => {
                    item.classList.add('pulse');
                    setTimeout(() => item.classList.remove('pulse'), 250);
                }, timeToReach);
            });
            
            // Fade out at end
            setTimeout(() => {
                packet.style.opacity = '0';
            }, duration - 300);
        }
        
        // Initial delay, then every 12 seconds
        setTimeout(() => {
            triggerPacket();
            setInterval(triggerPacket, 12000);
        }, 2000);

        // Add intersection observer for active states
        const activeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.5 });

        items.forEach(item => {
            activeObserver.observe(item);
        });

        return true;
    }

    // Attempt to init immediately
    if (!initPremiumTimeline()) {
        // If not found, wait for experience_data.js to inject it
        const observer = new MutationObserver((mutations, obs) => {
            if (initPremiumTimeline()) {
                obs.disconnect();
            }
        });
        
        const container = document.getElementById('experience-container');
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
        } else {
            // Fallback body observer
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
});
