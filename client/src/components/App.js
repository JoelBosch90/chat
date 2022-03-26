import React from 'react'
import { Socket } from 'phoenix'
import ChatRoomNavigation from './ChatRoomNavigation.js'
import ChatBox from './ChatBox.js'
import OverlayInput from './OverlayInput.js'
import './App.scss'

export default class App extends React.Component {

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

    // Construct the socket connection object.
    const socket = new Socket(`ws://${process.env.REACT_APP_API_URL}socket`, {
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

    // Construct the room object.
    const channel = this.state.connection.channel(`room:${name}`, {})

    // Join the room and start listening for messages.
    channel.join().receive('ok', response => {

      // Update our sender id with the response  for joining each channel.
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
   *  @todo   This currently only updates state. Later on the message will have
   *          to come from the server to have a reliable ID.
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
      <div className="app">
        <main>
          <ChatRoomNavigation
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
          <OverlayInput
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
