const jwt = require('jsonwebtoken');
const { JWT_SECRET, ADMIN_PASSWORD } = require('../config/env.config');

function login(req, res) {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).send("Invalid password");
    }
}

function checkAuth(req, res) {
    res.json({ authenticated: true });
}

module.exports = {
    login,
    checkAuth
};
