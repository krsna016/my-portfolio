document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const welcomeCard = document.getElementById('welcome-card');
    const welcomeTextElement = document.querySelector('.welcome-text');

    const messages = [
        "Hello, Traveller !",
        "Welcome Aboard !",
        "Nice to see you !",
        "Greetings, Friend !",
        "Explore my world !",
        "Code & Coffee ?",
        "Let's Build !",
        "Data is Beautiful",
        "Dream Big !",
        "Stay Curious !",
        "Innovation awaits",
        "Pixel Perfect",
        "Logic & Magic",
        "Hello World !",
        "Creating Future",
        "Design & Dev",
        "Art of Code",
        "Welcome, Guest !",
        "Enjoy your stay",
        "Let's Connect !"
    ];

    let typingInterval;

    if (logo && welcomeCard && welcomeTextElement) {
        logo.addEventListener('mouseenter', () => {
            // Show card
            welcomeCard.classList.add('visible');

            // Clear previous state
            clearInterval(typingInterval);
            welcomeTextElement.textContent = '';

            // Select random message
            const randomIndex = Math.floor(Math.random() * messages.length);
            const messageText = messages[randomIndex];

            const characters = Array.from(messageText);
            let charIndex = 0;
            const totalTime = 1500; // 1.5 seconds
            const intervalTime = totalTime / characters.length;

            // Create cursor element
            const cursor = document.createElement('span');
            cursor.className = 'welcome-cursor';
            welcomeTextElement.appendChild(cursor);

            typingInterval = setInterval(() => {
                if (charIndex < characters.length) {
                    // Insert character before cursor
                    cursor.before(characters[charIndex]);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, intervalTime);
        });

        logo.addEventListener('mouseleave', () => {
            clearInterval(typingInterval);
            welcomeCard.classList.remove('visible');
            welcomeTextElement.textContent = ''; // Clear immediately on leave
        });
    }
});
