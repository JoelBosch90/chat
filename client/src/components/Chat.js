import React, { useState, useEffect } from 'react'
import useLocalState from '../hooks/useLocalState.js'
import { Socket, Presence } from 'phoenix'
import ChatMeta from './Chat/Meta.js'
import ChatNavigation from './Chat/Navigation.js'
import ChatBox from './Chat/Box.js'
import Overlay from './Overlay.js'
import styles from './Chat.module.scss'
  
/**
 *  Function to connect to the message server to start receiving messages.
 *  @return {Object}
 */
const connect = () => {

  // If the website is running over HTTPS, we should also secure our
  // websocket connections.
  const protocol = window.location.protocol.startsWith('https') ? 'wss' : 'ws'

  // Construct the socket connection object.
  const socket = new Socket(`${protocol}://${window.location.host}/api/socket`)

  // Connect to the server.
  socket.connect()

  // Expose the socket.
  return socket
}

/**
 *  Function to delete a property from an object created with the useState hook.
 *  @param  {string}    property  Name of the property to remove from the state
 *                                object.
 *  @param  {Function}  setter    The second argument that's returned by the
 *                                useState hook that's used to update the state
 *                                object.
 */
const deleteStateProperty = (property, setter) => {
  setter(oldObject => {

    // Create a local copy we can safely manipulate.
    const copy = { ...oldObject }

    // Delete the property.
    delete copy[property]

    // Return the copy.
    return copy
  })
}

/**
 *  Functional component that displays the entire chat application.
 *  @returns  {JSX.Element}
 */
export default React.memo(function Chat() {

  // Create the state values that we want to back up locally.
  const [ currentRoomName, setCurrentRoomName ] = useLocalState('currentRoomName', '')
  const [ rooms, setRooms ] = useLocalState('rooms', {})

  // Create the state values that need to be reset on page load.
  const [ connection ] = useState(connect())
  const [ channels, setChannels ] = useState({})

  // Define the default room settings.
  const emptyRoom = { senderName: null, messages: [] }

  /**
   *  Function to get the current room from the rooms object if we can.
   *  @returns  {Object|undefined}
   */
  const currentRoom = () => rooms ? rooms[currentRoomName] : undefined

  /**
   *  Function to find the messages for the current room.
   *  @returns  {array}
   */
  const currentRoomMessages = () =>  currentRoom()?.messages || []

  /**
   *  Function to find the sender name for the current room.
   *  @returns  {string}
   */
  const currentRoomSenderName = () => currentRoom()?.senderName || ''

  /**
   *  Function to set a new sender name for the current room.
   *  @param  {string} senderName   New sender name.
   */
  const setCurrentRoomSenderName = senderName => {

    // Cannot set the sender name for the current room if no room is selected.
    if (!currentRoom()) return

    // Update the sender name for the current room.
    setRooms(rooms => ({ ...rooms, [currentRoomName]: { ...rooms[currentRoomName], senderName } }))
  }

  /**
   *  Function to unset the sender name for the current room.
   */
  const renameSender = () => void setCurrentRoomSenderName(null)

  /**
   *  Function to send a message.
   *  @param  {string}  text    Text of the new message to send.
   */
  const sendMessage = text => {

    // Get the current room.
    const room = currentRoom()

    // We do need a room, otherwise we cannot send anything.
    if (!room) return

    console.log('sendMessage', currentRoomName, text)

    // Use the channel for the current room to send the message and the current
    // name of the sender to the server.
    channels[currentRoomName].push("new_message", {
      text,
      sender_name: room.senderName
    })
  }
  
  /**
   *  Message to process receiving a new message.
   *  @param  {string}  roomName  Name of the chat room in which a message is
   *                              received.
   *  @param  {string}  senderId  Identifier for the current user.
   *  @param  {Object}  message   Received message object.
   *    @property {Number}  id            Unique message identifier.
   *    @property {Date}    time          Message timestamp.
   *    @property {string}  text          Message text.
   *    @property {Number}  sender_id     Unique sender identifier.
   *    @property {string}  sender_name   Sender's name.
   */
  const receiveMessage = (roomName, senderId, message) => {
    setRooms(rooms => {

      console.log('receiveMessage', roomName, senderId, message, JSON.stringify(rooms))

      // Check if this room already exists. If not, use the default room.
      const currentRoom = rooms[roomName] ?? emptyRoom
      
      // Construct the message object.
      const newMessage = {
        id: message.id,
        time: message.time,
        text: message.text,

        // Remap the message to fit React naming conventions.
        senderId: message.sender_id,
        senderName: message.sender_name,

        // The sender id might change on a page refresh or disconnect,
        // but we want to remember that the user sent this message, so
        // we want to store a persistent boolean value here rather than
        // a dynamically calculated value.
        self: message.sender_id === senderId,
      }

      // Add the new messages to the current room. Make sure to also keep all
      // previous messages. Make sure to add the new message in front.
      const updatedRoom = { ...currentRoom, messages: [ newMessage, ...currentRoom.messages ], }
      
      // Add the new room to the existing rooms.
      return { ...rooms, [roomName]: updatedRoom }
    })
  }

  /**
   *  Function to join a channel.
   *  @param  {string}  name  The name of the channel to join. This is usually
   *                          a channel by the same name of the room.
   */
  const joinChannel = name => {

    // No need to join the channel if we've already joined it.
    if (channels[name]) return

    console.log('joinChannel', name)

    // Construct a channel for this room.
    const channel = connection.channel(`room:${name}`, {})

    // Initialize a sender ID for the current user to our receive message
    // method.
    let senderId = 0;

    // Forward chat messages to the receive message method.
    channel.on('message', message => void receiveMessage(name, senderId, message))

    // Join the room and start listening for messages. Update our sender id with
    // the response for joining each channel.
    channel.join().receive('ok', response => { senderId = response.sender_id })

    // Add the channel to our collection.
    setChannels(channels => ({ ...channels, [name]: channel }))
  }

  /**
   *  Function to join a room.
   *  @param  {string}  name  The name of the room to join.
   */
  const joinRoom = name => {

    // We should have a valid name to join a room.
    if (!name) return

    console.log('joinRoom', name)

    // Join the channel for this room if we haven't already.
    if (!channels[name]) joinChannel(name)
    
    // Add an empty room with this name if we haven't already.
    if (!rooms[name]) setRooms(rooms => ({ ...rooms, [name]: emptyRoom }))
  }

  /**
   *  Function to select a room.
   *  @param  {string}  name  The name of the room to join.
   */
  const selectRoom = name => {

    console.log('selectRoom', name)

    // Make sure that we join this room.
    joinRoom(name)

    // Update the state.
    setCurrentRoomName(name)

    // Update the URL.
    window.history.pushState({}, '', encodeURI(`/room/${name}`))
  }

  /**
   *  Function to select a room from the current URL.
   */
  const selectRoomFromLocation = () => {

    // This function only joins rooms.
    if (!window.location.pathname?.startsWith('/room/')) return

    // Get the name of the room from the pathname.
    const room = decodeURI(window.location.pathname?.split('/')[2])

    // No need to join anything if we're already in the correct room.
    if (room === currentRoomName) return

    // Make sure that we join this room.
    joinRoom(room)

    // Update the current room state.
    setCurrentRoomName(room)
  }

  /**
   *  Function to deselect the current room. This will navigate away from the
   *  room, but keep its state for future reference.
   */
  const deselectRoom = () => {

    // Unset the current room name.
    setCurrentRoomName('')

    // Update the URL.
    window.history.pushState({}, '', '/')
  }

  /**
   *  Function to leave the current room. This will navigate away from the room
   *  and forget its state.
   */
  const leaveRoom = () => {

    // Make sure we remember the current room's name.
    const roomName = currentRoomName

    // Then deselect the current room.
    deselectRoom()

    // Leave the channel for this room if it has one.
    channels[roomName]?.leave()

    // Remove both the room and the channel.
    deleteStateProperty(roomName, setRooms)
    deleteStateProperty(roomName, setChannels)
  }

  // We want to do the following things only once, and not on ever rerender. We
  // can do that by using a useEffect that never repeats.
  useEffect(() => {

    console.log('useEffect')

    // On page load, make sure that we have a channel for each room.
    for (const roomName in rooms) joinChannel(roomName)
  
    // Start listening for navigation changes.
    window.addEventListener('popstate', selectRoomFromLocation)

    // Check if we should join a room based on the current location.
    selectRoomFromLocation()
  }, [])

  return (
    <div className={styles.chat}>
      <ChatMeta
        roomName={currentRoomName} 
        messages={currentRoomMessages()} 
      />
      <main className={currentRoomName ? styles.showRoom : ''}>
        <ChatNavigation
          rooms={rooms}
          currentRoom={currentRoomName}
          selectRoom={selectRoom}
        />
        <ChatBox 
          roomName={currentRoomName}
          messages={currentRoomMessages()}
          senderName={currentRoomSenderName()}
          sendMessage={sendMessage}
          updateName={setCurrentRoomSenderName}
          deselectRoom={deselectRoom}
          leaveRoom={leaveRoom}
          renameSender={renameSender}
        />
        <Overlay
          visible={!rooms || !Object.keys(rooms).length}
          title="What is the first room you want to join?"
          placeholder="E.g. Lobby 1..."
          button="Join"
          onSubmit={selectRoom}
        />
      </main>
    </div>
  )
})
