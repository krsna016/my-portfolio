const loginAttempts = {};

// Clean up expired rate limiter entries every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const ip in loginAttempts) {
        if (now > loginAttempts[ip].resetTime) {
            delete loginAttempts[ip];
        }
    }
}, 10 * 60 * 1000);

function rateLimitLogin(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!loginAttempts[ip]) {
        loginAttempts[ip] = { count: 1, resetTime: now + 15 * 60 * 1000 }; // 15 mins block
    } else {
        if (now > loginAttempts[ip].resetTime) {
            loginAttempts[ip] = { count: 1, resetTime: now + 15 * 60 * 1000 };
        } else {
            loginAttempts[ip].count++;
        }
    }

    if (loginAttempts[ip].count > 5) {
        const minutesLeft = Math.ceil((loginAttempts[ip].resetTime - now) / (60 * 1000));
        return res.status(429).send(`Too many login attempts. Please try again in ${minutesLeft} minutes.`);
    }

    next();
}

module.exports = {
    rateLimitLogin
};
