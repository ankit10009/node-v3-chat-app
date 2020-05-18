const users= []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id,username,room}) =>{
    //Clean the Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the Data
    if(!username || !room){
        return {
            error:  'UserName and room are required'
         }
    }

    //check for existing User
    const existingUser= users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser)
        return {
            error: 'Username is in Use'
        }

    //Store User
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1)
        return users.splice(index,1)[0]
}

const getUser = (id) =>{
    return users.find((user)=> user.id === id)
    
}

const getUsersInRoom = (room) =>{
    return users.filter((user)=> user.room === room.trim().toLowerCase() )
}


module.exports = {addUser,removeUser,getUser,getUsersInRoom}

