require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');
const config = require('./config/config');
const cookieParser = require("cookie-parser");

const app = express();
const PORT = config.PORT;

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/*splat", function (req, res, next) { // Allowing CORS
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use('/api/v1', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
