import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.js';
import { requestLogger } from './middlewares/requestLogger.js';

const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' });

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: [/localhost/, /ajafs\.br/], credentials: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use(requestLogger);

  app.use('/v1', routes);

  app.use(errorHandler);
  return app;
}
