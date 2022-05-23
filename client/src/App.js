import './App.css';
import {io} from 'socket.io-client';
import {useEffect, useState} from 'react';
import Chat from './Chat';
import { Routes, Route } from 'react-router-dom';

const socket = io('http://localhost:5000'); // initialize socket connection


function App() {
  
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [toggle, setToggle] = useState(false);
  const [problemState, setProblem] = useState(false);
  
  
  socket.on('connect', () => { // generic connect event
    console.log(`connected with socket_id:${socket.id}`)
  });

  const joinRoom = () => { // join room onclick event, check inputs and emit event to create a room server-side
    if ( (user !== '' && user) && (room !== '' && room) ){
      socket.emit('join_room', room, socket.id);
      setToggle(!toggle);
    } else { // handle messages (could be better done)
      if (user === '' || user === undefined) { 
          
        setProblem('Must enter a valid username!');

      } else if (room === '' || room === undefined) {
        
        setProblem('Must enter a valid roomname!');
      
      } else {
        setProblem('Unknown error :(')
      }
      timeErrors() 
    } 
  };

  function timeErrors () {
    setTimeout(() => setProblem(false), 3000)
  }

  return (
        <div className="App">
        {!toggle ? (
          <div className='joinChatContainer'> {/* could handle this better */}
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
            {problemState && 
              <div className='error-box'>
                <p className='error-msg'>
                  {problemState}
                </p> 
              </div>
            }
          </div>
        ):(
              <Chat socket={socket} user={user} room={room} />
        )}
        </div>
  ); 
}

export default App;
