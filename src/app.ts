
import express from "express";
import type { Request, Response, NextFunction } from "express";
import logger from './utils/logger.js';
import cors from 'cors';
import authRouter from './routes/authRouter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTERS
app.use('/auth', authRouter);


// SEED
//-------------------------------------------------
// await runSeed();
// LOGGER
//-------------------------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.http(`Request: ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('GOLD BORSE API is working .....!');
});
//-------------------------------------------------

export default app;