
#### LiveChatAppV2 ####
=============================================================================================================================
Alternative to my Live Chat App, this time including voicechat                                                                  

*currently a WIP*, init commit will include very bare bones webRTC
connection for videochat and a socket connection to a node server 
in order to support text chat at the same time.
libraries and tech:
React, Node, Express, Socket.io, PeerJs, concurrently(will probably be removed), nodemon
=============================================================================================================================

<>====<> Current bugs and plans: <>====<>

* () -need fix for user disconnect, frozen video remains on other users screen.

* () -need fix for refresh reseting entire chat app (architecture issue).

* (?) -possible that i could be added user auth and an account system along with saved groups/rooms(will need DB on node).

* () -need overall styling badly lol.

=============================================================================================================================