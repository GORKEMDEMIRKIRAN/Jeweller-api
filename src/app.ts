
import express from "express";
import type { Request, Response, NextFunction } from "express";
import logger from './utils/logger.js';
import cors from 'cors';

import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import customerRouter from './routes/customerRouter.js';
import productRouter from './routes/productRouter.js';
import transactionRouter from './routes/transactionRouter.js';

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTERS
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/customer', customerRouter);
app.use('/product', productRouter);
app.use('/transaction', transactionRouter);

// SWAGGER
//-------------------------------------------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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