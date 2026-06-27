// ==========================================
// 🎮 KONAMI CODE GRAVITY ENGINE EASTER EGG
// ==========================================

(function() {
    // Up, Up, Down, Down, Left, Right, Left, Right, B, A
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let keysPressed = [];
    let activated = false;
    const konamiString = konamiCode.join('').toLowerCase();

    document.addEventListener('keydown', (e) => {
        if (activated) return;
        
        keysPressed.push(e.key.toLowerCase());
        if (keysPressed.length > konamiCode.length) {
            keysPressed.shift();
        }
        
        if (keysPressed.join('') === konamiString) {
            activateGravityEngine();
            activated = true;
        }
    });

    function activateGravityEngine() {
        console.log("%c[GRAVITY ENGINE INITIATED] The Matrix is breaking...", "color: #00d2ff; font-weight: bold; font-size: 16px;");
        
        // 1. Flash the screen neon green
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0'; flash.style.left = '0'; flash.style.width = '100vw'; flash.style.height = '100vh';
        flash.style.backgroundColor = '#00ff00';
        flash.style.opacity = '0.5';
        flash.style.zIndex = '999999';
        flash.style.transition = 'opacity 1s ease-out';
        flash.style.pointerEvents = 'none';
        document.body.appendChild(flash);
        setTimeout(() => flash.style.opacity = '0', 50);
        setTimeout(() => flash.remove(), 1050);

        // 2. Load Matter.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
        script.onload = () => initPhysics();
        document.head.appendChild(script);
    }

    function initPhysics() {
        const Engine = Matter.Engine,
              Render = Matter.Render,
              Runner = Matter.Runner,
              Bodies = Matter.Bodies,
              Composite = Matter.Composite,
              Mouse = Matter.Mouse,
              MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create();
        const world = engine.world;

        // Create a transparent canvas overlay
        const render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent'
            }
        });
        
        render.canvas.style.position = 'fixed';
        render.canvas.style.top = '0';
        render.canvas.style.left = '0';
        render.canvas.style.zIndex = '9999';
        render.canvas.style.pointerEvents = 'none'; // We'll manage mouse events differently or enable it for interaction

        // We want to turn actual DOM elements into physics bodies, but syncing DOM with canvas is heavy.
        // Instead, we will hide the real DOM elements, and spawn identically styled blocks in Matter.js,
        // OR we can sync the DOM elements' positions to the Matter.js bodies in a requestAnimationFrame loop!

        // Let's do DOM syncing! It's way more intense.
        render.canvas.style.display = 'none'; // Hide the debug canvas

        const elements = document.querySelectorAll('p, h1, h2, h3, .btn, .card, .idea-bubble, img');
        const bodiesMap = new Map();

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Only process visible elements
            if (rect.width > 0 && rect.height > 0 && rect.top > -100 && rect.top < window.innerHeight + 100) {
                // Skip navbar to avoid getting trapped
                if (el.closest('.navbar')) return;

                const body = Bodies.rectangle(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    rect.width,
                    rect.height,
                    {
                        restitution: 0.8,
                        render: { visible: false }
                    }
                );

                // Prepare element for absolute positioning
                el.style.margin = '0';
                el.style.position = 'fixed'; // fixed to window
                el.style.width = rect.width + 'px';
                el.style.height = rect.height + 'px';
                el.style.zIndex = '9998';
                
                Composite.add(world, body);
                bodiesMap.set(el, body);
            }
        });

        // Add boundaries (walls and floor)
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
        Composite.add(world, [ground, leftWall, rightWall]);

        // Add mouse interaction
        const mouse = Mouse.create(document.body);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(world, mouseConstraint);

        // Run engine
        Runner.run(Runner.create(), engine);
        
        // Sync DOM loop
        (function updateDOM() {
            bodiesMap.forEach((body, el) => {
                el.style.left = (body.position.x - body.bounds.max.x + body.bounds.min.x/2) + 'px';
                // Calculate correct top/left based on center
                const width = el.offsetWidth;
                const height = el.offsetHeight;
                el.style.left = (body.position.x - width / 2) + 'px';
                el.style.top = (body.position.y - height / 2) + 'px';
                el.style.transform = \`rotate(\${body.angle}rad)\`;
            });
            requestAnimationFrame(updateDOM);
        })();

        // Make body overflow hidden to prevent scrollbars from freaking out
        document.body.style.overflow = 'hidden';
    }
})();
