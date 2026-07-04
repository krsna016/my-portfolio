/**
 * Premium Interactive Cyber Operations Globe
 * Elite Cybersecurity OS Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    // We must wait for three.js and globe.gl to be loaded
    if (typeof Globe === 'undefined' || typeof THREE === 'undefined') {
        console.warn('Globe.gl or Three.js failed to load.');
        return;
    }

    const container = document.getElementById('globe-viz');
    if (!container) return;

    // Remove the placeholder image if it still exists
    const placeholderImg = container.parentElement.querySelector('.profile-img');
    if (placeholderImg) placeholderImg.style.display = 'none';
    
    // Hide idea bubbles to avoid overlapping the 3D globe interactivity
    const bubbles = container.parentElement.querySelectorAll('.idea-bubble');
    bubbles.forEach(b => b.style.display = 'none');

    // Initialize Globe
    const globe = Globe()(container)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg') // Base dark texture
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundColor('#050505')
        .showAtmosphere(true)
        .atmosphereColor('#00d2ff')
        .atmosphereAltitude(0.15)
        .polygonCapColor(() => 'rgba(20, 20, 20, 0.9)')
        .polygonSideColor(() => 'rgba(0, 210, 255, 0.05)')
        .polygonStrokeColor(() => '#00d2ff')
        .polygonAltitude(0.01)
        .polygonsTransitionDuration(250);

    // Fetch GeoJSON data
    fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
        .then(res => res.json())
        .then(countries => {
            globe.polygonsData(countries.features);
            
            // Highlight India initially
            const india = countries.features.find(f => f.properties.ISO_A2 === 'IN');
            if (india) {
                setTimeout(() => {
                    globe.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 1.5 }, 2000);
                }, 1000);
            }
        });

    // Customization & Interactivity
    globe.polygonLabel(({ properties: d }) => `
        <div class="globe-tooltip">
            <div class="tt-title">${d.ADMIN}</div>
            <div class="intel-stat"><span class="intel-stat-label">Status</span><span class="intel-stat-value" style="color: #00FF41">ACTIVE</span></div>
            <div class="intel-stat"><span class="intel-stat-label">Security Score</span><span class="intel-stat-value">${Math.floor(85 + Math.random() * 14)}%</span></div>
            <div class="intel-stat"><span class="intel-stat-label">Servers</span><span class="intel-stat-value">${Math.floor(50 + Math.random() * 900)}</span></div>
            <div class="intel-stat"><span class="intel-stat-label">Traffic</span><span class="intel-stat-value">${(Math.random() * 5).toFixed(1)} Tbps</span></div>
        </div>
    `);

    let hoveredPolygon = null;
    globe.onPolygonHover(polygon => {
        hoveredPolygon = polygon;
        globe.polygonAltitude(d => d === hoveredPolygon ? 0.06 : 0.01)
             .polygonCapColor(d => d === hoveredPolygon ? 'rgba(0, 210, 255, 0.4)' : (d.properties.ISO_A2 === 'IN' ? 'rgba(0, 210, 255, 0.15)' : 'rgba(20, 20, 20, 0.9)'));
    });

    const intelPanel = document.getElementById('cyber-intel-panel');
    const intelContent = document.getElementById('intel-panel-content');
    const closePanelBtn = document.getElementById('close-intel-panel');

    closePanelBtn.addEventListener('click', () => {
        intelPanel.classList.add('hidden');
    });

    globe.onPolygonClick(polygon => {
        const d = polygon.properties;
        
        // Move camera
        const [lng, lat] = globe.getCoords(polygon); // Approximate center? globe.gl doesn't natively expose poly center easily, we can use pointOfView without coords to just rely on user zoom, or calculate it.
        // For simplicity, just pop the panel
        
        intelPanel.classList.remove('hidden');
        
        if (d.ISO_A2 === 'IN') {
            // Personal Integration
            intelContent.innerHTML = `
                <div class="intel-stat"><span class="intel-stat-label">IDENTITY</span><span class="intel-stat-value" style="color: #00FF41">ANURAG PAREEK</span></div>
                <div class="intel-stat"><span class="intel-stat-label">Role</span><span class="intel-stat-value">Data Analyst / Engineer</span></div>
                <div class="intel-stat"><span class="intel-stat-label">Focus</span><span class="intel-stat-value">AI, Cyber, Big Data</span></div>
                <div class="intel-stat"><span class="intel-stat-label">Headquarters</span><span class="intel-stat-value">Active</span></div>
                <div class="intel-stat"><span class="intel-stat-label">Clearance</span><span class="intel-stat-value">LEVEL 9</span></div>
            `;
        } else {
            intelContent.innerHTML = `
                <div class="intel-stat"><span class="intel-stat-label">Country</span><span class="intel-stat-value">${d.ADMIN}</span></div>
                <div class="intel-stat"><span class="intel-stat-label">ISO</span><span class="intel-stat-value">${d.ISO_A2}</span></div>
                <div class="intel-stat"><span class="intel-stat-label">Pop Est</span><span class="intel-stat-value">${(d.POP_EST / 1000000).toFixed(1)}M</span></div>
                <div class="intel-stat"><span class="intel-stat-label">Threat Level</span><span class="intel-stat-value" style="color: #66D9FF">ELEVATED</span></div>
                <div class="intel-stat"><span class="intel-stat-label">Live Connections</span><span class="intel-stat-value">${Math.floor(Math.random() * 1000)}</span></div>
            `;
        }
    });

    // Add glowing nodes (Servers/Cities)
    const gData = [...Array(150).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 160,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() * 0.5 + 0.1,
        color: ['#00d2ff', '#00FF41', '#ffffff'][Math.floor(Math.random() * 3)]
    }));

    globe.pointsData(gData)
        .pointAltitude(0.01)
        .pointColor('color')
        .pointRadius('size')
        .pointsMerge(true); // GPU instancing for performance

    // Arcs (Network Connections)
    function generateRandomArcs(count) {
        return [...Array(count).keys()].map(() => ({
            startLat: (Math.random() - 0.5) * 160,
            startLng: (Math.random() - 0.5) * 360,
            endLat: (Math.random() - 0.5) * 160,
            endLng: (Math.random() - 0.5) * 360,
            color: [['rgba(0, 210, 255, 0.6)', 'rgba(255, 255, 255, 0.6)'], ['rgba(0, 255, 65, 0.6)', 'rgba(0, 210, 255, 0.6)']][Math.floor(Math.random() * 2)]
        }));
    }
    
    let arcsData = generateRandomArcs(30);
    globe.arcsData(arcsData)
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(2000)
        .arcStroke(0.5);

    // Pulse Waves
    const ringsData = [];
    globe.ringsData(ringsData)
        .ringColor(() => '#00d2ff')
        .ringMaxRadius(5)
        .ringPropagationSpeed(2)
        .ringRepeatPeriod(700);

    setInterval(() => {
        if (Math.random() > 0.3) {
            ringsData.push({
                lat: (Math.random() - 0.5) * 160,
                lng: (Math.random() - 0.5) * 360
            });
            // Keep array small
            if (ringsData.length > 5) ringsData.shift();
            globe.ringsData(ringsData);
        }
    }, 2000);

    // Satellites
    const satData = [...Array(5).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 160,
        lng: (Math.random() - 0.5) * 360,
        alt: Math.random() * 0.4 + 0.1,
        radius: 0.2,
        speed: Math.random() * 0.02 + 0.01,
        label: ['AWS', 'Azure', 'GCP', 'GitHub', 'Docker'][Math.floor(Math.random() * 5)]
    }));

    globe.customLayerData(satData)
        .customThreeObject(d => {
            const geom = new THREE.SphereGeometry(d.radius, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ color: '#fff' });
            return new THREE.Mesh(geom, mat);
        })
        .customThreeObjectUpdate((obj, d) => {
            Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt));
        });

    // Auto-rotation & Animation Loop
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5; // ~80s per rotation
    globe.controls().enableDamping = true;
    globe.controls().dampingFactor = 0.05;

    // Disable auto-rotate on interaction
    globe.controls().addEventListener('start', () => {
        globe.controls().autoRotate = false;
    });

    // Terminal Notifications
    const notifBox = document.getElementById('globe-notifications');
    const notifMsgs = [
        "Connection Established",
        "Route Optimized",
        "Packet Verified",
        "Secure Tunnel Created",
        "Identity Authenticated",
        "Encrypted Payload Sent"
    ];

    setInterval(() => {
        if (Math.random() > 0.4) {
            const msg = notifMsgs[Math.floor(Math.random() * notifMsgs.length)];
            const hex = "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
            
            const div = document.createElement('div');
            div.className = 'globe-notif';
            div.innerText = `[${hex}] ${msg}`;
            notifBox.prepend(div);
            
            if (notifBox.children.length > 5) {
                notifBox.removeChild(notifBox.lastChild);
            }
            
            setTimeout(() => {
                if (div.parentNode) div.parentNode.removeChild(div);
            }, 2500);
        }
    }, 3000);

    // Dynamic Arc updates
    setInterval(() => {
        arcsData = generateRandomArcs(30);
        globe.arcsData(arcsData);
    }, 15000); // Every 15 seconds new connections
});
