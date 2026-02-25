require('dotenv').config();
const { httpServer } = require('./app');

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
