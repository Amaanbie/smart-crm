import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';

import authRoutes from './modules/auth/auth.routes.js';
import leadsRoutes from './modules/leads/leads.routes.js';
import activitiesRoutes from './modules/activities/activities.routes.js';
import { default as notesRoutes } from './modules/notes/notes.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

export default app;
