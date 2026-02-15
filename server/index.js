require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');
const config = require('./config/config');
const { initializeRedis } = require('./utils/redisClient');
const { startSessionExpiryWorker } = require('./utils/sessionExpiryWorker');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = config.PORT;

connectDB();
initializeRedis();
startSessionExpiryWorker();

app.use("/*splat", function (req, res, next) {
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://myevalio.tech',
        'https://myevalio.tech',
        'http://localhost:3000'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, userId");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    
    next();
});

app.use(express.json());
app.use(cookieParser());

app.use('/health', ( req, res ) => {
    res.status(200).json({ message: 'Server is healthy' });
});
app.use('/api/v1', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
