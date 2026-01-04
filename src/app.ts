import log4js from 'log4js';
import express from 'express';
import cors from 'cors';
import routers from './routers';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

const logger = log4js.getLogger();
app.use(log4js.connectLogger(logger, { level: 'auto' }));

app.use('/', routers);
app.use(errorHandler);

export default app;