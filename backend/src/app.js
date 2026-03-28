import express from 'express';
import router from './routes/tasksRoute.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import { logger } from './middlewares/loggerMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Dotenv
dotenv.config();

//Custome Logger
app.use(logger);

//Middleware
app.use(express.json());

//Router
app.use('/api', router);

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