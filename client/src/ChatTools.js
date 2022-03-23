import Peer from 'peerjs';

export function initStreamChat(socket, callWindow, myCall){
    

    const thisPeer = new Peer(undefined, {
        host: '/',
        port: `8080`
    });

    thisPeer.on('open', peerID => {
        socket.emit('join-call', peerID)
    })
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then( stream => {
        addVideoStream(myCall, stream, callWindow)

        thisPeer.on('call', call => {
            call.answer(stream)
            
        })
        
        socket.on('user-joined-call', peerID => {
            connectToNewUser(peerID, stream, thisPeer,callWindow)
        })
    })
}


const addVideoStream = (video, stream, callWindow) => {
    video.srcObject = stream
    console.log(callWindow)
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    console.log("APPEND")
    callWindow.append(video)
}

const connectToNewUser = (userId, outboundStream, thisPeer, callWindow) => {
    console.log('CONNECT TO NEW USER')
    const call = thisPeer.call(userId, outboundStream)
    const video = document.createElement('video')
    call.on('stream', inboundStream => {
        console.log('STREEEEEEMMMM')
        addVideoStream(video, inboundStream, callWindow)
    })
    call.on('close', () => {
        video.remove()
    })
}