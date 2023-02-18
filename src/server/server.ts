import express, { Request, Response } from 'express';
import next from 'next';
import bodyParser from 'body-parser';
import { server as serverLog } from 'log-type';

import { connect } from '../database/database';
import { ensureDefaultUser } from '../database/user';

import userRouter from '../api/user';
import { User } from '../shared/types/user';

const isDevelopment = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 8000;

const app = next({ dev: isDevelopment });
const handler = app.getRequestHandler();

(async () => {
  try {
    // Start everything we want.
    serverLog('Starting the server...');
    await app.prepare();
    const server = express();

    // Middleware
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    // Routers
    server.use('', userRouter);

    // Web server.
    server.all('*', (req: Request, res: Response) => {
      return handler(req, res);
    });
    server.listen(port, (error?: any) => {
      if (error) {
        throw error;
      }

      // Print some info.
      serverLog(`Ready on http://localhost:${port}`);
      serverLog(`NODE_ENV: ${process.env.NODE_ENV}`);
      serverLog('Server startup complete.');
    });

    // Database - Do the initial cache.
    await connect();
    await ensureDefaultUser();
  } catch (error: any) {
    throw error;
  }
})();
