///require start////
const dotenv = require('dotenv')
const express = require('express')
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');
///require end////
dotenv.config()
const app = express()
const server = http.createServer(app)
const io = socketio(server)
///set static folder///
app.use(express.static(path.join(__dirname,'public')))
////
io.on('connection',socket=>{
    socket.on('chat-room',({username,room})=>{
        const user = userJoin(socket.id,username,room)
        socket.join(user.room)
        ///welcom corrent user///
        socket.emit('message',formatMessage('admine','welcom'))
        ///Brodcast when a user login//
        socket.broadcast.to(user.room).emit('message',formatMessage('admine',`<span class='user'>"${user.username}"</span> => has joined` ))
        ///send user and room info 
        io.to(user.room).emit('roomUsers',{room:user.room,users:getRoomUsers(user.room)})
    })
    /// liste, to the chat messages////
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id)
        socket.broadcast.to(user.room).emit('message',formatMessage(user.username,msg))
        socket.emit('self',formatMessage(user.username,msg))
    })
    ///run when client disconnected//
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message',formatMessage('admin',`<span class='user'>${user.username}</span> has left the chat`))
            ///send user and room info 
        io.to(user.room).emit('roomUsers',{room:user.room,users:getRoomUsers(user.room)})
        }
        
    })
})

server.listen(3000, () => console.log(`Example app listening on port port!`))