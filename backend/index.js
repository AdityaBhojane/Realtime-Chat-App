import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Map to store active users (socket.id => username)
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining with a username
  socket.on("join", (username) => {
    if (username) {
      activeUsers.set(socket.id, username);
      console.log(`User joined: ${username}`);

      // Broadcast the updated user list to all connected clients
      updateUserList();
    }
  });

  // Handle message sending
  socket.on("sendMessage", ({ to, from, content }) => {
    const recipientId = Array.from(activeUsers.entries()).find(([id, name]) => name === to)?.[0];
    if (recipientId) {
      socket.to(recipientId).emit("receiveMessage", {
        sender: from,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    activeUsers.delete(socket.id);
    updateUserList();
  });

  // Helper function to broadcast the updated user list
  const updateUserList = () => {
    io.emit(
      "userList",
      Array.from(activeUsers.entries()).map(([id, name]) => ({ id, name }))
    );
  };
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
