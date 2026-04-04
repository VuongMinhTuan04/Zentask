import express from 'express';
import taskRouter from './routes/tasksRoute.js';
import authRouter from './routes/authRoute.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import { logger } from './middlewares/loggerMiddleware.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Dotenv
dotenv.config();

//CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//Custome Logger
app.use(logger);

//Middleware
app.use(express.json());

//Router
app.use('/api', taskRouter);
app.use('/api', authRouter);

//Not Found
app.use((req, res) => {
    res.status(404).json({ message: 'Page Not Found 404' });
});

//Connection Database
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Zentask App Listening on port http://localhost:${PORT}/api/tasks`);
        });
    })
    .catch(error => console.error(error));