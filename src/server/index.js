const app = require('./app');
const { PORT } = require('./config/env.config');

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Live CMS Server running at http://0.0.0.0:${PORT}`);
});
