
#### LiveChatAppV2 ####

<h2>Alternative to my Live Chat App, this time including voicechat</h2>                                                                  


<h5>Currently this remains a WIP,</h5> <h7>The init commit will include very bare bones webRTC
connection for videochat and a socket connection to a node server 
in order to support text chat at the same time.</h7>
<h5>libraries and tech:<h5>
 <p>React, Node, Express, Socket.io, PeerJs, concurrently(will probably be removed), nodemon</p>

============================================================================================

<>====<> Current bugs and plans: <>====<>

* (1/2) -need fix for user disconnect, frozen video remains on other users screen.
        
        > about half of this has been fixed, users who leave will have their videos removed
          from other users clients.. however if the user who left joined before the other,
          the user who was last in will be stuck with a black window. 
        
        # (something about peer objects being set to state at the wrong time.)

* () -need fix for refresh reseting entire chat app (architecture issue).

* (?) -possible that i could add user auth and an account system along with saved groups/rooms.

* (3/4) -need overall styling updates.
        
        > for its purposes most styling has been changed to scale better, although i may 
          go with another theme later down the line.

* () -would really like to create a push to talk/key binding system or even a audio level filter 

==========================================================================================
