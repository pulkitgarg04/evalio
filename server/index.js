require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');
const config = require('./config/config');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();
const PORT = config.PORT;

connectDB();

app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'http://myevalio.tech',
        'https://myevalio.tech',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'userId']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
