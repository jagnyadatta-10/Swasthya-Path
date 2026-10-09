// WebRTC Peer-to-Peer Signaling & Real-Time Consultation Socket Handler

export function setupSignaling(io) {
  // Track active rooms: roomId -> Set of socket records
  const activeRooms = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket Connected] ID: ${socket.id}`);

    // Peer joins a consultation room
    socket.on('join-room', ({ roomId, userId, userName, userRole }) => {
      if (!roomId) return;

      socket.join(roomId);
      socket.data = { roomId, userId, userName, userRole };

      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, new Map());
      }
      const roomPeers = activeRooms.get(roomId);

      // List existing peers for the newly joined peer
      const existingPeers = [];
      roomPeers.forEach((peerData, peerSocketId) => {
        existingPeers.push({
          socketId: peerSocketId,
          userId: peerData.userId,
          userName: peerData.userName,
          userRole: peerData.userRole
        });
      });

      // Register current peer in room
      roomPeers.set(socket.id, { userId, userName, userRole });

      console.log(`[Room: ${roomId}] ${userName} (${userRole}) joined. Total peers: ${roomPeers.size}`);

      // Send existing peers list to the joining peer
      socket.emit('existing-peers', existingPeers);

      // Notify other peers in room about new peer
      socket.to(roomId).emit('peer-joined', {
        socketId: socket.id,
        userId,
        userName,
        userRole
      });
    });

    // Relay WebRTC Offer
    socket.on('offer', ({ targetSocketId, offer }) => {
      console.log(`[WebRTC] Forwarding Offer from ${socket.id} to ${targetSocketId}`);
      io.to(targetSocketId).emit('offer', {
        senderSocketId: socket.id,
        offer
      });
    });

    // Relay WebRTC Answer
    socket.on('answer', ({ targetSocketId, answer }) => {
      console.log(`[WebRTC] Forwarding Answer from ${socket.id} to ${targetSocketId}`);
      io.to(targetSocketId).emit('answer', {
        senderSocketId: socket.id,
        answer
      });
    });

    // Relay ICE Candidates
    socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('ice-candidate', {
        senderSocketId: socket.id,
        candidate
      });
    });

    // Real-Time In-Call Chat Delivery
    socket.on('chat-message', ({ roomId, message }) => {
      if (!roomId || !message) return;
      console.log(`[Chat in ${roomId}] from ${message.senderName}: ${message.text?.slice(0, 30)}...`);
      io.to(roomId).emit('chat-message', message);
    });

    // Real-Time E-Prescription Push to Patient during or at end of call
    socket.on('rx-issued', ({ roomId, prescription }) => {
      if (!roomId || !prescription) return;
      console.log(`[Rx Issued in ${roomId}] ${prescription.prescriptionNumber} for ${prescription.patientName}`);
      io.to(roomId).emit('rx-issued', prescription);
    });

    // Clinician or Patient Ends Call
    socket.on('end-call', ({ roomId }) => {
      if (!roomId) return;
      console.log(`[Call Concluded] Room: ${roomId} initiated by ${socket.id}`);
      socket.to(roomId).emit('call-ended', { initiatorSocketId: socket.id });
    });

    // Disconnect cleanup
    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected] ID: ${socket.id}`);
      const roomId = socket.data?.roomId;
      if (roomId && activeRooms.has(roomId)) {
        const roomPeers = activeRooms.get(roomId);
        roomPeers.delete(socket.id);
        if (roomPeers.size === 0) {
          activeRooms.delete(roomId);
        } else {
          socket.to(roomId).emit('peer-disconnected', { socketId: socket.id });
        }
      }
    });
  });
}
