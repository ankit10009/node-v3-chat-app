
const socket =  io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar= document.querySelector('#sidebar')


//templates
messagetemplate = document.querySelector('#message-template').innerHTML
locationtemplate = document.querySelector('#location-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username, room } = Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoScroll = ()=>{
    // New Message Element
    const $newMessage = $messages.lastElementChild
    //Height of the new Message
    const newMessageStyles= getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    //Visible Height
    const visibleHeight = $messages.offsetHeight
    //Height of the message container
    const containerHeight = $messages.scrollHeight
    //How far I have Scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(msg)=>{
    console.log(msg)
    const html = Mustache.render(messagetemplate,{
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('locationMessage',(message)=>{
    // console.log(url)
    const html = Mustache.render(locationtemplate,{
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
}) 

socket.on('roomData',({room, users})=>{
    const html = Mustache.render(sideBarTemplate,{
        room,
        users
    })
    $sidebar.innerHTML = html
})


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    
    $messageFormButton.setAttribute('disabled' ,'disabled')
    
    //disabled
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{        
        
        //enabled
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error)
            return console.log(error)        
        console.log('Message delivered')
    })    
})

$sendLocationButton.addEventListener('click',()=>{
    
    
    if(!navigator.geolocation)
        return alert('Geolocation is not supported by your browser')

        $sendLocationButton.setAttribute('disabled' ,'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared !')
        })
    })
})

socket.emit('join', {username, room }, (error)=>{
    if(error){
        alert(error)
        location.href ='/'
    }

})
