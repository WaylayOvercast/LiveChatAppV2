import './App.css';
import {io} from 'socket.io-client';
import {useEffect, useState} from 'react';
import Chat from './Chat';
import { Routes, Route } from 'react-router-dom';

const socket = io('http://localhost:5000');


function App() {
  
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [toggle, setToggle] = useState(false);
  
  
  socket.on('connect', () => {
    console.log(`connected with socket_id:${socket.id}`)
  });

  const joinRoom = () => {
    if((user !== '' && user !== undefined) && (room !== '' && room !== undefined)){
      socket.emit('join_room', room, socket.id);
      setToggle(!toggle);
    }
  };

  return (
        <div className="App">
        {!toggle ? (
          <div className='joinChatContainer'>
            <h3>Join A Chat Room!</h3>
            <input
              type='text'
              placeholder='Username..'
              onChange={(e) => {
                setUser(e.target.value);
              }}
            />
            <input 
              type='text'
              placeholder='Room Name..'
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
            <button onClick={joinRoom}>Join</button>
          </div>
        ):(
              <Chat socket={socket} user={user} room={room} />
        )}
        </div>
  ); 
}

export default App;
