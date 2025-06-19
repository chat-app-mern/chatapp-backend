const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { connectDb } = require('./config/db');
const { userRouter } = require('./routes/userRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config({ path: './config/.env' });

const app = express();
connectDb();

const corsOptions = {
    origin: [
        'https://user-management-system-nine-omega.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000/'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/user', userRouter);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on ${port}.`);
});
