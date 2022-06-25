import React, {useEffect, useRef, useState} from 'react'
import Peer from 'peerjs';

function Chat({socket, user, room}){

    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([]);
    const [voiceChat, setVoiceChat] = useState(false);
    const [peers, setPeers] = useState([])
    

    useEffect(() => {

        socket.on('user-joined-room', socket_id => {
            console.log(`User joined room with id:${socket_id}`)
        });

        socket.on('msg_client', (msgInfo) => {
            setChat((chat) => [...chat, msgInfo])
        });

        socket.on('user-has-left', socket_id => {
            console.log(`User left room with id:${socket_id}`)
            console.log('ISPEER?', peers[socket_id])
            if(peers[socket_id]) {
        
                const leaving = peers[socket_id]
                const staying = peers.filter( obj => obj.peer !== socket_id)
                console.log('staying', staying)
                leaving.close() // issue with closing another persons stream if they were first to join room, (something about state being set WIP)
                
                setPeers(staying)
                
            }
        });

    },[])

    useEffect(() => {
        console.log('LOOK HERE', peers)
    },[peers])

    useEffect(() => {

        const callWindow = document.getElementById('call-window')
        const myCall = document.createElement('video')
        myCall.muted = true
    
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then( stream => {
            
            console.log(socket.id, stream)
            addVideoStream(myCall, stream, callWindow)
            initStreamchat(stream, callWindow)
        });

    },[])
    
    const initStreamchat = (stream, callWindow) => {

        const thisPeer = new Peer(socket.id, {
            host: '/',
            port: `8080`
        });

        thisPeer.on('open', peerId => {
            const currentUser = { peerId: peerId, username: user }
            socket.emit('join-call', currentUser)
        });

        thisPeer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')

            call.on('stream', inboundStream => {
                console.log('INBOUND', inboundStream)
                addVideoStream(video, inboundStream, callWindow)
            })
           console.log('CALLL', call)
           setPeers((peers) => [...peers, peers[call.peer] = call]) // look into this as i think peers need to be set later on. 
           console.log(peers)
        });

        socket.on('user-joined-call', peer => {
            console.log('user joined call line 53')
            connectToNewUser(peer, stream, thisPeer, callWindow)
        });

    }

    const addVideoStream = (video, stream, callWindow) => {

        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })

        callWindow.append(video)
        console.log('APPEND')
    }

    const connectToNewUser = (otherUser, outboundStream, currentUser, callWindow) => {

        const call = currentUser.call(otherUser.peerId, outboundStream)
        const video = document.createElement('video')
        
        video.innerText = otherUser.username

        console.log('create video element line 69', video)

        call.on('stream', inboundStream => {
            addVideoStream(video, inboundStream, callWindow)
            console.log('add video stream line 72')
        })

        call.on('close', () => {
            console.log('CLOSE, 82')
            video.remove()
        })

        console.log('USER JOINED', otherUser.peerId)
        setPeers((peers) => [...peers, peers[otherUser.peerId] = call]) // this works, as shown in the object contains Options: _stream: MediaStream
    }

    const sendMsg = async (e) => {
        e.preventDefault()
        if((msg !== '' && msg !== undefined)){
            const msgInfo = {
                room: room,
                user: user,
                msg: msg,
                time: 
                    new Date(Date.now()).getHours() 
                    + ":" + 
                    new Date(Date.now()).getMinutes()
            };
            await socket.emit('handle_msg', msgInfo);
            setChat((chat) => [...chat, msgInfo])
            setMsg('')
        }
    };

    return (
        <>
        <div id='call-window'>         
        </div>
        <div className='chat-window'>
            <div className='chat-head'>
                <div className='room-tag'><p>{room}</p></div>
            </div>
            <div className='chat-mid'>
                {chat.map((msg, i) => {
                    return (
                    <div key = {i} className='message' id={user === msg.user ? "you" : "other"}>
                        <div>
                            <div className='message-content'>
                                <p>{msg.msg}</p>
                            </div>
                            <div className='message-meta'>
                                <p id="time">{msg.time}</p>
                                <p id="author">{msg.user}</p>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
            <div className='chat-foot'>
                <form  className='chat-form' onSubmit={(e) => sendMsg(e)}>
                    <input 
                        className='chat-input'
                        type='text' 
                        placeholder = '...'
                        value={msg}
                        onChange={(e) => {
                            setMsg(e.target.value)
                        }}
                    />
                    <button
                        className='send-msg'
                        type='submit'>
                            Send
                    </button>
                </form>
            </div>
        </div>
        </>
    )
}

export default Chat