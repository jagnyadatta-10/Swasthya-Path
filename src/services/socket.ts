import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    // In dev with Vite proxy, connecting to current origin connects to /socket.io
    const serverUrl = window.location.port === '5173' ? 'http://localhost:3001' : window.location.origin;
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1500
    });

    socket.on('connect', () => {
      console.log(`[Socket Connected to Telehealth Bridge] ID: ${socket?.id}`);
    });

    socket.on('connect_error', (err: Error) => {
      console.warn('[Socket Connection Alert] Retrying telehealth bridge connection:', err.message);
    });
  }

  return socket;
}
