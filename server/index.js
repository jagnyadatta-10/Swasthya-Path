import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSignaling } from './signaling.js';
import authRoutes from './routes/auth.js';
import prescriptionRoutes from './routes/prescriptions.js';
import consultationRoutes from './routes/consultations.js';
import labRoutes from './routes/lab.js';
import pharmacyRoutes from './routes/pharmacy.js';
import adminRoutes from './routes/admin.js';

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS for WebRTC signaling
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger for real-world observability
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Swasthya Path Telehealth Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Initialize real-time WebRTC Signaling & Consultation Rooms
setupSignaling(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log('========================================================');
  console.log(`🚀 SWASTHYA PATH PRODUCTION SERVER ACTIVE ON PORT ${PORT}`);
  console.log(`📡 WebRTC Signaling Server Ready for P2P Video Calls`);
  console.log(`💾 SQLite Persistent Database Engine Loaded`);
  console.log('========================================================');
});
