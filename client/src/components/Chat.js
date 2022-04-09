import React, { useState } from 'react'
import useLocalState from '../hooks/useLocalState.js'
import { Socket } from 'phoenix'
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
 *  Functional component that displays the entire chat application.
 *  @returns  {JSX.Element}
 */
export default function Chat() {

  // Create the state values that we want to back up locally.
  const [ currentRoomName, setCurrentRoomName ] = useLocalState('currentRoomName', '')
  const [ rooms, setRooms ] = useLocalState('rooms', {})

  // Create the state values that need to be reset on page load.
  const [ connection ] = useState(connect())
  const [ channels, setChannels ] = useState({})

  // Define the default room settings.
  const emptyRoom = { senderName: null, messages: [] }

  /**
   *  Function to get the current room object.
   *  @returns  {Object}
   */
  const currentRoom = () => {

    // Get the current room from the rooms object if we can.
    return currentRoomName && rooms && rooms[currentRoomName] ? rooms[currentRoomName] : null
  }

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
    if (!(currentRoomName in rooms)) return

    // Update the sender name for the current room.
    setRooms(rooms => ({ ...rooms, [currentRoomName]: { ...rooms[currentRoomName], senderName } }))
  }

  /**
   *  Function to send a message.
   *  @param  {string}  text    Text of the new message to send.
   */
  const sendMessage = text => {

    // Get the current room.
    const room = currentRoom()

    // We do need a room, otherwise we cannot send anything.
    if (!room) return

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
      return {...rooms, [roomName]: updatedRoom }
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

    // Construct a channel for this room.
    const channel = connection.channel(`room:${name}`, {})

    // Join the room and start listening for messages. Update our sender id with
    // the response for joining each channel.
    channel.join().receive('ok', response => {

      // Forward chat messages to the receive message method.
      channel.on('message', message => void receiveMessage(name, response.sender_id, message))
    })

    // Add the channel to our collection.
    setChannels({ ...channels, [name]: channel })
  }

  /**
   *  Function to join a room.
   *  @param  {string}  name  The name of the room to join.
   */
  const joinRoom = name => {

    // If the room already exists and has a valid channel object, we can
    // immediately select it instead.
    if (rooms?.name && channels[name]) return setCurrentRoomName(name)

    // Join the channel for this room.
    joinChannel(name)
    
    // Add an empty room with this name.
    setRooms(rooms => ({...rooms, [name]: emptyRoom }))

    // Also immediately select the new room.
    setCurrentRoomName(name)
  }

  // On page load, make sure that we have a channel for each room.
  for (const roomName in rooms) joinChannel(roomName)

  return (
    <div className={styles.chat}>
      <main>
        <ChatNavigation
          rooms={rooms}
          currentRoom={currentRoomName}
          selectRoom={setCurrentRoomName}
          joinRoom={joinRoom}
        />
        <ChatBox 
          roomName={currentRoomName}
          messages={currentRoomMessages()}
          senderName={currentRoomSenderName()}
          sendMessage={sendMessage}
          updateName={setCurrentRoomSenderName}
        />
        <Overlay
          visible={!rooms || !Object.keys(rooms).length}
          title="What is the first room you want to join?"
          placeholder="E.g. Lobby 1..."
          button="Join"
          onSubmit={joinRoom}
        />
      </main>
    </div>
  )
}