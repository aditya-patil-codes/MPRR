const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// use cors middleweare

app.use(cors());

const server = http.createServer(app);
//imp
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms = {}; // Store rooms with their hosts and players

io.on("connection", (socket) => {
  console.log(`User connected with id: ${socket.id}`);

  // Listen for room creation
  socket.on("createRoom", ({ username }) => {
    const roomId = Math.random().toString(36).substring(2, 10); // Generate a random roomId
    rooms[roomId] = {
      host: username,
      players: [{ id: socket.id, username }],
    };
    socket.join(roomId);
    socket.emit("roomCreated", roomId); // Send the roomId back to the client
    io.in(roomId).emit("playersUpdate", rooms[roomId].players); // Broadcast players to the room
  });

  // Listen for room joining
// Listen for room joining
socket.on("joinRoom", ({ roomId, username }) => {
  if (rooms[roomId]) {
    if (rooms[roomId].players.length >= 3) { // Check if room is full
      socket.emit("error", "Room is full."); // Emit an error if full
      return;
    }
    
    rooms[roomId].players.push({ id: socket.id, username });
    socket.join(roomId);  
    console.log(`User ${username} joined room: ${roomId}`);
    io.in(roomId).emit("playersUpdate", rooms[roomId].players); // Broadcast players to the room
    socket.to(roomId).emit("userJoined", `${username} has joined the room`);
  } else {
    socket.emit("error", "Room does not exist.");
  }
});

  // Handle disconnection
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const playerIndex = rooms[roomId].players.findIndex((player) => player.id === socket.id);
      if (playerIndex !== -1) {
        const player = rooms[roomId].players.splice(playerIndex, 1)[0];
        io.in(roomId).emit("playersUpdate", rooms[roomId].players); // Update players list
        if (rooms[roomId].players.length === 0) {
          delete rooms[roomId]; // Remove room if no players
        }
        break;
      }
    }
  });
});


server.listen(5000, () => {
  console.log("server is running on port 5000");
});
