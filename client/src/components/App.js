import React from 'react'
import { Socket } from 'phoenix'
import ChatRoomList from './ChatRoomList.js'
import ChatBox from './ChatBox.js'
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
      senderId: 0,
      senderName: 'Sender 1',
      currentRoom: 'Room 1',
      rooms: {
        'Room 1': {
          channel: null,
          messages: [
            {
              id: 3,
              time: Date.now() - 1300012,
              text: 'Example text message 3.',
              senderId: 2886,
              senderName: 'Self',
              self: true,
            },
            {
              id: 2,
              time: Date.now() - 2300340,
              text: 'Example text message 2.',
              senderId: 2886,
              senderName: 'Other',
              self: false,
            },
            {
              id: 1,
              time: Date.now() - 3000430,
              text: 'Example text message 1.1.',
              senderId: 2886,
              senderName: 'Self',
              self: true,
            },
          ]
        },
      },
    }

    // Create a new connection on each page refresh.
    this.state.connection = this.connect()

    // Make sure that we bind the send methods that we pass to the child
    // components to the state of this component.
    this.connect = this.connect.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
    this.currentRoomMessages = this.currentRoomMessages.bind(this)
    this.currentRoom = this.currentRoom.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.receiveMessage = this.receiveMessage.bind(this)
    this.selectRoom = this.selectRoom.bind(this)
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

    // Add the new room to our state.
    this.setState(state => { return {
      rooms: Object.assign({}, state.rooms, {

        // Override an existing room if need be.
        [name]: {

          // Add the channel to the room.
          channel,

          // Inherit messages from a previous room if possible.
          messages: state.rooms[name] ? state.rooms[name].messages : []
        },
      })
    }})
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
   *  Method to get the current room object.
   *  @returns  {Object}
   */
  currentRoom () {

    // Get the current room from the state.
    return this.state.rooms[this.state.currentRoom]
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
      sender_name: this.state.senderName
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
    this.setState(state => {

      // Get the named room.
      const room = state.rooms[roomName]

      // Update the named room with this new message.
      return {
        rooms: Object.assign({}, state.rooms, {
          [roomName]: Object.assign({}, room, {
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
        })
      }
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
   *  Method to store the state to local storage.
   */
  storeState () {

    // Create a copy of the state.
    const state = Object.assign({}, this.state)

    console.log({ state })

    // Remove all references to channel objects. JSON cannot handle these
    // references.
    for (const room in state.rooms) delete state.rooms[room].channel

    // Also remove the connection object.
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
   *  @returns {Object}
   */
  render () {
    return (
      <div className="app">
        <main> 
          <ChatRoomList
            rooms={this.state.rooms}
            currentRoom={this.state.currentRoom}
            selectRoom={this.selectRoom}
          />
          <ChatBox 
            messages={this.currentRoomMessages()}
            senderId={this.state.senderId}
            sendMessage={this.sendMessage}
          />
        </main>
      </div>
    )
  }
}
