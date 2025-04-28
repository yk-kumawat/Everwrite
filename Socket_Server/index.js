const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

const getAllConnectedClients = (roomID) => {
    return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
        (socketID) => {
            return {
                socketID,
                nickname: userSocketMap[socketID],
            }
        }
    )
};

io.on('connection', (socket) => {
    console.log(`User Connected : ${socket.id}`);
    socket.on('join', ({ roomID, nickname }) => {
        userSocketMap[socket.id] = nickname;
            socket.join(roomID);
        const clients = getAllConnectedClients(roomID);
        clients.forEach(({ socketID }) => {
            io.to(socketID).emit('joined', { clients, nickname, socketID: socket.id })
        })
    })
    socket.on("titleChange", ({ roomID, title }) => {
        console.log(`Received titleChange for room ${roomID}: ${title}`);
        socket.to(roomID).emit("titleChange", { title });
      });
      
      socket.on("elementChange", ({ roomID, element }) => {
        console.log(`Received elementChange for room ${roomID}:`, element);
        socket.to(roomID).emit("elementChange", { element });
      });
      
      socket.on("contentChange", ({ roomID, id, content }) => {
        console.log(`Received contentChange for room ${roomID}: ID=${id}, Content=${content}`);
        socket.to(roomID).emit("contentChange", { id, content });
      });
      
      socket.on("canvasChange", ({ roomID, id, content }) => {
        socket.to(roomID).emit("canvasChange", { id, content });
      });
      
      socket.on("deleteElement", ({ roomID, id }) => {
        console.log("Broadcasting element deletion:", id);
        socket.to(roomID).emit("deleteElement", { id });
      });
      
      socket.on("brushColorChange", ({ roomID, color }) => {
        console.log("Broadcasting brush color change:", color);
        socket.to(roomID).emit("brushColorChange", { color });
      });
      
      socket.on("brushSizeChange", ({ roomID, size }) => {
        console.log("Broadcasting brush size change:", size);
        socket.to(roomID).emit("brushSizeChange", { size });
      });
      
    
      socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomID) => {
          socket.in(roomID).emit("disconnected", {
            socketID: socket.id,
            nickname: userSocketMap[socket.id],
          });
        });
        delete userSocketMap[socket.id];
        socket.leave();
      });
})


const PORT = 5000;
server.listen(PORT, () => console.log('Socket Server is Running'))  