const port = 5000
const express = require('express');
const http = require('http');

    const corsOPTIONS = {
        origin: '*',
        credentials: true
    }

const server = express();
const httpserver = http.createServer(server);
const io = require('socket.io')(httpserver, {cors: corsOPTIONS});
httpserver.listen(port, () => { 
    console.log(`server online @port: ${port}`)
});




io.on('connection', socket => {
    console.log(`User connected with socket_id:${socket.id}`);
    
    socket.on('join_room', (room, socket_id) => {
        console.log(`User with socket_id:${socket_id} Joined Room:${room}`);
        socket.join(room);
        socket.to(room).emit('user-joined-room', socket_id);
        
        socket.on('join-call', peerID => {
            socket.to(room).emit('user-joined-call', peerID)
        })
        socket.on('disconnect', () => {
            socket.to(room).emit('user-has-left', socket_id)
        })
        
    });

    socket.on('handle_msg', (msg) => {
        socket.to(msg.room).emit('msg_client', (msg));
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected with socket_id:${socket.id}`);
    })
});

