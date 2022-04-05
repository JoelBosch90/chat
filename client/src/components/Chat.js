import React, { useState } from 'react'
import { Socket } from 'phoenix'
import ChatNavigation from './Chat/Navigation.js'
import ChatBox from './Chat/Box.js'
import Overlay from './Overlay.js'
import styles from './Chat.module.scss'

// /**
//  *  Functional component that displays the entire chat application.
//  * 
//  *  @param    {Object}  props   React props passed by the parent element.
//  *  @returns  {JSX.Element}
//  */
// export default function Chat(props) {

//   /**
//    *  Helper function to augment a setState function to also store to local
//    *  storage.
//    *  @param    {string}    name    Name of the state.
//    *  @param    {Function}  setter  Function that sets the state.
//    *  @returns  {Function}
//    */
//   const saveLocalState = (name, setter) => {
//     return state => {

//       // First set the state using the setter function.
//       setter(state)

//       // Create a local copy we can change.
//       const copy = Object.assign({}, state);

//       // Delete all channel properties that rooms may have.
//       for (const [property, instance] of Object.entries(copy)) if (instance.hasOwnProperty('channel')) delete copy[property].channel

//       // Next, store the item to local storage as well.
//       window.localStorage.setItem(name, JSON.stringify(copy))
//     }
//   }

//   /**
//    *  Helper function to 
//    *  @param    {string}  name      Name of the state.
//    *  @param    {any}     value     Default value for this state.
//    *  @returns  {array}
//    */
//   const useLocalState = (name, value) => {

//     // Check if we can find a state with this name in local storage. If not,
//     // use the provided default value.
//     const initial = window.localStorage.hasOwnProperty(name) ? JSON.parse(window.localStorage.getItem(name)) : value

//     // First use the React hook to get the state variable and setter function.
//     const [state, setState] = useState(initial)

//     // Use our saveState function to make sure we always save state locally.
//     return [state, saveLocalState(name, setState)]
//   }
  
//   /**
//    *  Function to connect to the message server to start receiving messages.
//    *  @return {Object}
//    */
//   const connect = () => {

//     // If the website is running over HTTPS, we should also secure our
//     // websocket connections.
//     const protocol = window.location.protocol.startsWith('https') ? 'wss' : 'ws'

//     // Construct the socket connection object.
//     const socket = new Socket(`${protocol}://${window.location.host}/api/socket`, {
//       params: {},
//     })

//     // Connect to the server.
//     socket.connect()

//     // Expose the socket.
//     return socket
//   }

//   // Create the state values that we want to back up locally.
//   const [senderId, setSenderId] = useLocalState('senderId', null)
//   const [currentRoomName, setCurrentRoomName] = useLocalState('currentRoomName', null)
//   const [rooms, setRooms] = useLocalState('rooms', {})

//   // Create the state values that need to be reset on page load.
//   const [connection, setConnection] = useState(connect())

//   /**
//    *  Function to get the current room object.
//    *  @returns  {Object}
//    */
//   const currentRoom = () => {

//     // Get the current room from the rooms object if we can.
//     return currentRoomName in rooms ? rooms[currentRoomName] : null
//   }

//   /**
//    *  Function to find the messages for the current room.
//    *  @returns  {array}
//    */
//   const currentRoomMessages = () => {

//     // Get the current room.
//     const room = currentRoom()

//     // Return the room's messages if it exists.
//     if (room) return room.messages
    
//     // Default to an empty array.
//     else return []
//   }

//   /**
//    *  Method to update the state for a single room.
//    *  @param  {string}  roomName  Name of the room to update.
//    *  @param  {Object}  update    Object containing the updates for this room.  
//    */
//   const updateRoom = (roomName, update) => {

//     // Get the named room or create one with all defaults.
//     const room = rooms[roomName] || {
//       channel: null,
//       senderName: null,
//       messages: [],
//     }

//     // Update the named room with the new state.
//     setRooms(Object.assign({}, rooms, {

//       // Keep all of the room's previous properties if possible.
//       [roomName]: Object.assign({}, room, update)
//     }))
//   }

//   /**
//    *  Function to find the sender name for the current room.
//    *  @returns  {string}
//    */
//   const currentRoomSenderName = () => {

//     // Get the current room.
//     const room = currentRoom()

//     // Return the room's sender name if it exists.
//     if (room) return room.senderName
    
//     // Default to an empty string.
//     else return ''
//   }

//   /**
//    *  Function to set a new sender name for the current room.
//    *  @param  {string} name  New sender name.
//    */
//   const setCurrentRoomSenderName = name => {

//     // Update the senderName property for the current room.
//     updateRoom(currentRoomName, { senderName: name })
//   }

//   /**
//    *  Function to send a message.
//    *  @param  {string}  text    Text of the new message to send.
//    */
//   const sendMessage = text => {

//     // Get the current room.
//     const room = currentRoom()

//     // Send the message and the current name of the sender to the server.
//     room.channel.push("new_message", {
//       text,
//       sender_name: room.senderName
//     })
//   }
  
//   /**
//    *  Message to process receiving a new message.
//    *  @param  {string}  roomName  Name of the chat room in which a message is
//    *                              received.
//    *  @param  {Object}  message   Received message object.
//    *    @property {Number}  id            Unique message identifier.
//    *    @property {Date}    time          Message timestamp.
//    *    @property {string}  text          Message text.
//    *    @property {Number}  sender_id     Unique sender identifier.
//    *    @property {string}  sender_name   Sender's name.
//    */
//   const receiveMessage = (roomName, message) => {
//     updateRoom(roomName, {
//       messages: [

//         // Insert the message object.
//         {
//           id: message.id,
//           time: message.time,
//           text: message.text,

//           // Remap the message to fit React naming conventions.
//           senderId: message.sender_id,
//           senderName: message.sender_name,

//           // The sender id might change on a page refresh or disconnect,
//           // but we want to remember that the user sent this message, so
//           // we want to store a persistent boolean value here rather than
//           // a dynamically calculated value.
//           self: message.sender_id === senderId,
//         },

//         // Keep the other messages.
//         ...currentRoomMessages(),
//       ]
//     })
//   }

//   /**
//    *  Function to join a room.
//    *  @param  {string}  name  The name of the room to join.
//    */
//   const joinRoom = name => {

//     // If the room already exists and has a valid channel object, we can
//     // immediately select it instead.
//     if (name in rooms && rooms[name].channel) return setCurrentRoomName(name)

//     // Construct the room object.
//     const channel = connection.channel(`room:${name}`, {})

//     // Join the room and start listening for messages.
//     channel.join().receive('ok', response => {

//       // Update our sender id with the response for joining each channel.
//       setSenderId(response.sender_id)

//       // Forward chat messages to the receive message method.
//       channel.on('message', message => void receiveMessage(name, message))
//     })

//     // Add the new room to our state.
//     updateRoom(name, { channel })

//     // Also immediately select the new room.
//     setCurrentRoomName(name)
//   }

//   return (
//     <div className={styles.chat}>
//       <main>
//         <ChatNavigation
//           rooms={rooms}
//           currentRoom={currentRoomName}
//           selectRoom={setCurrentRoomName}
//           joinRoom={joinRoom}
//         />
//         <ChatBox 
//           roomName={currentRoomName}
//           messages={currentRoomMessages()}
//           senderName={currentRoomSenderName()}
//           senderId={senderId}
//           sendMessage={sendMessage}
//           updateName={setCurrentRoomSenderName}
//         />
//         <Overlay
//           visible={!rooms.length}
//           title="What is the first room you want to join?"
//           placeholder="E.g. Lobby 1..."
//           button="Join"
//           onSubmit={joinRoom}
//         />
//       </main>
//     </div>
//   )
// }

export default class Chat extends React.Component {

  /**
   *  Constructor.
   *  @param  {Object}  props   Any properties passed down to this component.
   */
  constructor(props) {

    // First call the parent constructor.
    super(props)

    // Recover the state from local storage if we can. Otherwise, we set the
    // default settings.
    this.state = JSON.parse(window.localStorage.getItem('state')) || {
      senderId: null,
      currentRoom: null,
      rooms: {},
    }

    // Create a new connection on each page refresh.
    this.state.connection = this.connect()

    // Make sure that we bind all methods that are shared with other components
    // to this component so that they keep access to this component's state.
    for(const method of [
      'selectRoom', 'joinRoom', 'sendMessage', 'setSenderName',
    ]) this[method] = this[method].bind(this)
  }

  /**
   *  Method to connect to the message server to start receiving messages.
   *  @return {Object}
   */
  connect () {

    // If the website is running over HTTPS, we should also secure our
    // websocket connections.
    const protocol = window.location.protocol.startsWith('https') ? 'wss' : 'ws';

    // Construct the socket connection object.
    const socket = new Socket(`${protocol}://${window.location.host}/api/socket`, {
      params: {},
    })

    // Connect to the server.
    socket.connect()

    // Expose the socket.
    return socket
  }

  /**
   *  Method to join a room.
   *  @param  {string}  name  The name of the room to join.
   */
  joinRoom (name) {

    // If the room already exists and has a valid channel object, we can
    // immediately select it instead.
    if (name in this.state.rooms && this.state.rooms[name].channel) return this.selectRoom(name)

    // Construct the room object.
    const channel = this.state.connection.channel(`room:${name}`, {})

    // Join the room and start listening for messages.
    channel.join().receive('ok', response => {

      // Update our sender id with the response for joining each channel.
      this.setState({ senderId: response.sender_id })

      // Forward chat messages to the receive message method.
      channel.on('message', message => void this.receiveMessage(name, message))
    })

    // Make sure that we immediately select the new room if we've not selected
    // any yet.
    if (!this.state.currentRoom) this.setState({ currentRoom: name })

    // Add the new room to our state.
    this.updateRoom(name, { channel })

    // Also immediately select the new room.
    this.selectRoom(name)
  }

  /**
   *  Method to get the current room object.
   *  @returns  {Object}
   */
  currentRoom () {

    // Get the current room from the state.
    return this.state.rooms[this.state.currentRoom]
  }

  /**
   *  Method to find the messages for the current room.
   *  @returns  {array}
   */
  currentRoomMessages () {

    // Get the current room.
    const room = this.currentRoom()

    // Return the room's messages if it exists.
    if (room) return room.messages
    
    // Default to an empty array.
    else return []
  }

  /**
   *  Method to find the sender name for the current room.
   *  @returns  {string}
   */
  currentRoomSenderName () {

    // Get the current room.
    const room = this.currentRoom()

    // Return the room's sender name if it exists.
    if (room) return room.senderName
    
    // Default to an empty string.
    else return ''
  }

  /**
   *  Method to send a message.
   *  @param  {string}  text    Text of the new message to send.
   */
  sendMessage (text) {

    // Get the current room.
    const room = this.currentRoom()

    // Send the message and the current name of the sender to the server.
    room.channel.push("new_message", {
      text,
      sender_name: room.senderName
    })
  }

  /**
   *  Method to update the state for a single room.
   *  @param  {string}  roomName  Name of the room to update.
   *  @param  {Object}  update    Object containing the updates for this room.  
   */
  updateRoom(roomName, update) {
    this.setState(state => {

      // Get the named room or create one with all defaults.
      const room = state.rooms[roomName] || {
        channel: null,
        senderName: null,
        messages: [],
      }

      // Update the named room with the new state.
      return {

        // Keep all other rooms.
        rooms: Object.assign({}, state.rooms, {

          // Keep all of the room's previous properties if possible.
          [roomName]: Object.assign({}, room, update)
        })
      }
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
  receiveMessage (roomName, message) {
    this.updateRoom(roomName, {
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
          self: message.sender_id === this.state.senderId,
        },

        // Keep the other messages.
        ...this.currentRoomMessages(),
      ]
    })
  }

  /**
   *  Method to select a new room.
   *  @param  {string} name  Name of the room to select.
   */
  selectRoom (name) {
    this.setState({ currentRoom: name })
  }

  /**
   *  Method to set a new sender name for the current room.
   *  @param  {string} name  New sender name.
   */
  setSenderName (name) {

    // Update the senderName property for the current room.
    this.updateRoom(this.state.currentRoom, { senderName: name })
  }

  /**
   *  Method to store the state to local storage.
   */
  storeState () {

    // Create a copy of the state that we can change.
    const state = Object.assign({}, this.state)

    // Remove all references to channel and connection objects. JSON cannot
    // handle these references and we do not need them.
    for (const room in state.rooms) delete state.rooms[room].channel
    delete state.connection

    // Now we can store the entire state.
    window.localStorage.setItem('state', JSON.stringify(state))
  }

  /**
   *  Method called when the component has been mounted.
   */
  componentDidMount () {

    // Join all existing rooms.
    for(const room in this.state.rooms) this.joinRoom(room)

    // Store the state when a user leaves the page.
    window.addEventListener('beforeunload', this.storeState.bind(this))
  }

  /**
   *  Method called when the componet is about to be unmounted.
   */
  componentWillUnmount () {

    // First, store the state.
    this.storeState()

    // Now, we can stop listening for when the user leaves the page as this
    // component will no longer be part of the part.
    window.removeEventListener('beforeunload', this.storeState.bind(this))
  }

  /**
   *  Method called to render the component.
   *  @returns {JSX.Element}
   */
  render () {
    return (
      <div className={styles.chat}>
        <main>
          <ChatNavigation
            rooms={this.state.rooms}
            currentRoom={this.state.currentRoom}
            selectRoom={this.selectRoom}
            joinRoom={this.joinRoom}
          />
          <ChatBox 
            roomName={this.state.currentRoom}
            messages={this.currentRoomMessages()}
            senderName={this.currentRoomSenderName()}
            senderId={this.state.senderId}
            sendMessage={this.sendMessage}
            updateName={this.setSenderName}
          />
          <Overlay
            visible={!Object.keys(this.state.rooms).length}
            title="What is the first room you want to join?"
            placeholder="E.g. Lobby 1..."
            button="Join"
            onSubmit={room => this.joinRoom(room)}
          />
        </main>
      </div>
    )
  }
}
