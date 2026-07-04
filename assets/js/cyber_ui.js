document.addEventListener('DOMContentLoaded', () => {
    // Inject Cyber Crosshairs
    const crossX = document.createElement('div');
    crossX.className = 'cyber-crosshair-x';
    document.body.appendChild(crossX);

    const crossY = document.createElement('div');
    crossY.className = 'cyber-crosshair-y';
    document.body.appendChild(crossY);

    const coords = document.createElement('div');
    coords.className = 'cyber-coords';
    document.body.appendChild(coords);

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        crossX.style.top = `${e.clientY}px`;
        crossY.style.left = `${e.clientX}px`;
        
        coords.style.top = `${e.clientY + 10}px`;
        coords.style.left = `${e.clientX + 10}px`;
        coords.innerHTML = `x: ${e.clientX}<br>y: ${e.clientY}`;
    });

    // Inject System Status
    const statusBox = document.createElement('div');
    statusBox.className = 'system-status';
    document.body.appendChild(statusBox);

    function updateStatus() {
        const d = new Date();
        const time = d.toUTCString().replace('GMT', 'UTC');
        const viewport = `${window.innerWidth}x${window.innerHeight}`;
        
        statusBox.innerHTML = `
            <span>CLIENT: PORTFOLIO_OS</span>
            <span>VIEWPORT: ${viewport}</span>
            <span>SYSTEM_TIME: ${time}</span>
            <span>SEC_LEVEL: ALPHA</span>
        `;
    }
    
    updateStatus();
    setInterval(updateStatus, 1000);

});
