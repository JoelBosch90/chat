import React, { useState } from 'react'
import useLocalState from '../hooks/useLocalState.js'
import { Socket } from 'phoenix'
import ChatNavigation from './Chat/Navigation.js'
import ChatBox from './Chat/Box.js'
import Overlay from './Overlay.js'
import styles from './Chat.module.scss'

/**
 *  Functional component that displays the entire chat application.
 * 
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function Chat(props) {
  
  /**
   *  Function to connect to the message server to start receiving messages.
   *  @return {Object}
   */
  const connect = () => {

    // If the website is running over HTTPS, we should also secure our
    // websocket connections.
    const protocol = window.location.protocol.startsWith('https') ? 'wss' : 'ws'

    // Construct the socket connection object.
    const socket = new Socket(`${protocol}://${window.location.host}/api/socket`, {
      params: {},
    })

    // Connect to the server.
    socket.connect()

    // Expose the socket.
    return socket
  }

  // Create the state values that we want to back up locally.
  const [senderId, setSenderId] = useLocalState('senderId', 0)
  const [currentRoomName, setCurrentRoomName] = useLocalState('currentRoomName', '')
  const [rooms, setRooms] = useLocalState('rooms', {})

  // Create the state values that need to be reset on page load.
  const [connection, setConnection] = useState(connect())
  const [channels, setChannels] = useState({})

  /**
   *  Function to get the current room object.
   *  @returns  {Object}
   */
  const currentRoom = () => {

    // Can only get the current room if we remember its name.
    if (!currentRoomName) return null

    // Get the current room from the rooms object if we can.
    return currentRoomName in rooms ? rooms[currentRoomName] : null
  }

  /**
   *  Function to find the messages for the current room.
   *  @returns  {array}
   */
  const currentRoomMessages = () => {

    // Get the current room.
    const room = currentRoom()

    // Return the room's messages if it exists.
    if (room && room.messages) return room.messages
    
    // Default to an empty array.
    else return []
  }

  /**
   *  Method to update the state for a single room.
   *  @param  {string}  roomName  Name of the room to update.
   *  @param  {Object}  update    Object containing the updates for this room.  
   */
  const updateRoom = (roomName = '', update = {}) => {

    // Get properties for an existing room if we can, but make sure we at least
    // have some default values.
    const room = {

      // Start with the defaults.
      ...{ senderName: null, messages: [] },

      // Get properties from an existing room if we can.
      ...rooms[roomName],

      // Now add the update.
      ...update,
    }

    // Update the named room with the new state.
    setRooms({ ...rooms, [roomName]: room })
  }

  /**
   *  Function to find the sender name for the current room.
   *  @returns  {string}
   */
  const currentRoomSenderName = () => {

    // Get the current room.
    const room = currentRoom()

    // Return the room's sender name if it exists.
    if (room) return room.senderName
    
    // Default to an empty string.
    else return ''
  }

  /**
   *  Function to set a new sender name for the current room.
   *  @param  {string} name  New sender name.
   */
  const setCurrentRoomSenderName = name => {

    // Update the senderName property for the current room.
    updateRoom(currentRoomName, { senderName: name })
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
    else channels[currentRoomName].push("new_message", {
      text,
      sender_name: room.senderName
    })
  }
  
  /**
   *  Message to process receiving a new message.
   *  @param  {string}  roomName  Name of the chat room in which a message is
   *                              received.
   *  @param  {Object}  message   Received message object.
   *    @property {Number}  id            Unique message identifier.
   *    @property {Date}    time          Message timestamp.
   *    @property {string}  text          Message text.
   *    @property {Number}  sender_id     Unique sender identifier.
   *    @property {string}  sender_name   Sender's name.
   */
  const receiveMessage = (roomName, message) => {

    console.log('receiveMessage', { senderName: rooms?.Kitchen?.senderName })

    updateRoom(roomName, {
      messages: [

        // Insert the message object.
        {
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
        },

        // Keep the other messages.
        ...currentRoomMessages(),
      ]
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

    // Join the room and start listening for messages.
    channel.join().receive('ok', response => {

      // Update our sender id with the response for joining each channel.
      setSenderId(response.sender_id)

      console.log('joinChannelOk', { rooms, senderName: rooms?.Kitchen?.senderName })

      // Forward chat messages to the receive message method.
      channel.on('message', message => { console.log('joinChannelMessage', { rooms, senderName: rooms?.Kitchen?.senderName }); receiveMessage(name, message) })
    })

    // Add the channel to our collection.
    setChannels({

      // Make sure to keep the other channels.
      ...channels,

      // And add the new channel for this room.
      [name]: channel,
    })
  }

  /**
   *  Function to join a room.
   *  @param  {string}  name  The name of the room to join.
   */
  const joinRoom = name => {

    // If the room already exists and has a valid channel object, we can
    // immediately select it instead.
    if (name in rooms && channels[name]) return setCurrentRoomName(name)

    // Join the channel for this room.
    joinChannel(name)

    // Add the new room to our state.
    updateRoom(name)

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
          senderId={senderId}
          sendMessage={sendMessage}
          updateName={setCurrentRoomSenderName}
        />
        <Overlay
          visible={!Object.keys(rooms).length}
          title="What is the first room you want to join?"
          placeholder="E.g. Lobby 1..."
          button="Join"
          onSubmit={joinRoom}
        />
      </main>
    </div>
  )
}