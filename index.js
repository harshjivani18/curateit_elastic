require('dotenv').config();

const PORT  = process.env.PORT || 8000;
const app   = require('./src/server');

app.listen(PORT, () => {
    console.info('Server is running on port %s', PORT);
});

module.exports = app