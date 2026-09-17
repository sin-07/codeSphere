import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import { CONFIG } from './config';
import { connectDB } from './db/db';
import { gitHttpHandler } from './git/gitHttpBackend';

import authRoutes from './routes/auth';
import repoRoutes from './routes/repos';
import prRoutes from './routes/pullRequests';
import issueRoutes from './routes/issues';
import releaseRoutes from './routes/releases';
import ciRoutes from './routes/ci';
import aiRoutes from './routes/ai';
import orgRoutes from './routes/orgs';
import userRoutes from './routes/users';
import notificationRoutes from './routes/notifications';

const app = express();
const server = http.createServer(app);

// Setup Socket.io
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Presence map: roomId -> Map<socketId, { username, avatarUrl, cursor }>
const roomPresence = new Map<string, Map<string, any>>();

io.on('connection', (socket) => {
  // Join presence room (e.g. repo:demo-dev/demo-repo or file:...)
  socket.on('presence:join', ({ room, user }) => {
    socket.join(room);
    if (!roomPresence.has(room)) {
      roomPresence.set(room, new Map());
    }
    const currentUsers = roomPresence.get(room)!;
    currentUsers.set(socket.id, user);

    io.to(room).emit('presence:update', Array.from(currentUsers.values()));
  });

  socket.on('cursor:move', ({ room, position, user }) => {
    socket.to(room).emit('cursor:moved', { socketId: socket.id, position, user });
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (roomPresence.has(room)) {
        const users = roomPresence.get(room)!;
        users.delete(socket.id);
        io.to(room).emit('presence:update', Array.from(users.values()));
      }
    }
  });
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));

// Git HTTP Smart Protocol routes (handled with raw streams before body parser!)
app.use('/git/:owner/:repo', gitHttpHandler);
app.use('/:owner/:repo.git', gitHttpHandler);

// Body parsers for REST endpoints
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CodeSphere Core API & Git Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/pulls', prRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/ci', ciRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

import { seedDatabase } from './seed';
import { DataService, UserModel } from './models';

// Start Server
export async function startServer() {
  await connectDB();

  // Auto-seed demo data if database is unseeded
  try {
    const userCount = await DataService.count('users', UserModel);
    if (userCount === 0) {
      console.log('[Server] Database is empty. Running initial demo seed...');
      await seedDatabase();
    }
  } catch (err) {
    console.warn('[Server] Auto-seed check skipped or failed:', err);
  }

  server.listen(CONFIG.PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 CodeSphere API Server running on port ${CONFIG.PORT}`);
    console.log(`📦 Git Smart HTTP clone URL: http://localhost:${CONFIG.PORT}/git/:owner/:repo.git`);
    console.log(`🧠 AI Engine URL: ${CONFIG.AI_ENGINE_URL}`);
    console.log(`===================================================`);
  });
}

if (require.main === module) {
  startServer();
}

export default app;
