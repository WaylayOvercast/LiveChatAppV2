const port = 5000
const express = require('express');
const http = require('http');

const corsOPTIONS = { // cors variable
    origin: '*',
    credentials: true
}

const server = express();                                           // useing express wrapper
const httpserver = http.createServer(server);                      // and creating http express server
const io = require('socket.io')(httpserver, {cors: corsOPTIONS}); // passing the Httpserver to socket.io with corsOptions


httpserver.listen(port, () => {
    console.log(`server online @port: ${port}`)
});




io.on('connection', socket => {
    console.log(`User connected with socket_id:${socket.id}`);
    
    socket.on('join_room', (room, socket_id) => {                                   //------------------------------------------------//
        console.log(`User with socket_id:${socket_id} Joined Room:${room}`);       // declaring socket connections and functionality //
        socket.join(room);                                                        //------------------------------------------------//
        socket.to(room).emit('user-joined-room', socket_id);
        
        socket.on('join-call', peer => {
            socket.to(room).emit('user-joined-call', peer)
        })
        socket.on('handle_msg', (msg) => {
            socket.to(msg.room).emit('msg_client', (msg));
        })
        socket.on('disconnect', () => {
            socket.to(room).emit('user-has-left', socket_id)
        })
        // important that certain connections are only able to be used in specific scopes
    });

    

    socket.on('disconnect', () => {
        console.log(`User disconnected with socket_id:${socket.id}`);
    }) // disconnect event, should trigger WebRTC disconnect too
});

