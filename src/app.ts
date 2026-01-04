import express from 'express';
import cors from 'cors';
import routers from './routers';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());
app.use('/', routers);
app.use(errorHandler);

export default app;
