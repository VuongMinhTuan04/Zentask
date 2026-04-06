import express from 'express';
import taskRouter from './routes/tasksRoute.js';
import authRouter from './routes/authRoute.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import { logger } from './middlewares/loggerMiddleware.js';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Dotenv
dotenv.config();

//CORS
if(process.env.NODE_ENV !== 'production') {
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
    }));
}

//Custome Logger
app.use(logger);

//Middleware
app.use(express.json());

//Router
app.use('/api', taskRouter);
app.use('/api', authRouter);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

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