/* ==========================================================================
   MASTER INTENSE ENGINEERING PACK INITIALIZER
   Dynamically loads all modular intense features & cyberpunk HUD stylesheets
   ========================================================================== */

(function() {
    // 1. Inject Stylesheet
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'assets/css/intense_features/intense_pack.css';
    document.head.appendChild(cssLink);

    // 2. Modular JS Loader
    const modules = [
        'assets/js/intense_features/sound_haptics.js',
        'assets/js/intense_features/terminal.js',
        'assets/js/intense_features/ide_sandbox.js',
        'assets/js/intense_features/git_ticker.js',
        'assets/js/intense_features/ai_twin.js',
        'assets/js/intense_features/dsa_visualizer.js'
    ];

    modules.forEach(src => {
        const s = document.createElement('script');
        s.src = src;
        s.defer = true;
        document.body.appendChild(s);
    });

    console.log("⚡ [AGY-ENGINE]: All 7 intense engineering superpowers loaded & initialized.");
})();
