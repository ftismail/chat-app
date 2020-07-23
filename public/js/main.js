const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const usersList = document.getElementById('users')
///get username and url room ////
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
const socket = io()
socket.on('message',message=>{
    console.log(message)
    outPutMessage(message)
    chatMessage.scrollTop = chatMessage.scrollHeight
})
socket.on('self',message=>{
    selfMessage(message)
    chatMessage.scrollTop = chatMessage.scrollHeight
})
///join Chat-room//
socket.emit('chat-room',{username,room})
///get room and users//
socket.on('roomUsers',({room,users})=>{
    outPutRoomName(room)
    outPutUsers(users)
})
///message submit///
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    ///get message from the output
    let msg = e.target.elements.msg.value;
    ///senf message to the server
    socket.emit('chatMessage',msg)
    cleanUp()
})
function cleanUp(){
    document.getElementById('msg').value = ''
    document.getElementById('msg').focus()
}
function outPutMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}
function selfMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta-self">${message.username} <span>${message.time}</span></p>
    <p class="text text-self" >
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}
function outPutRoomName(room){
    roomName.innerHTML= room
}
function outPutUsers(users){
    usersList.innerHTML = `
        ${users.map(e=>`<li>${e.username}</li>`).join('')}
    `
}