import React from 'react'
import { Socket } from 'phoenix'
import ChatRoomList from './ChatRoomList.js'
import ChatBox from './ChatBox.js'
import './App.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSender: {
        id: 1,
        name: 'Sender 1'
      },
      currentRoom: 'Room 2',
      rooms: {
        'Room 1': {
          channel: null,
          messages: [
            {
              id: 6,
              time: Date.now(),
              text: 'Example text message 6.',
              sender: {
                id: 2,
                name: 'Sender 2'
              }
            },
            {
              id: 5,
              time: Date.now() - 300450,
              text: 'Example text message 5.',
              sender: {
                id: 2,
                name: 'Sender 2'
              }
            },
            {
              id: 4,
              time: Date.now() - 500053,
              text: 'Example text message 4.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
            {
              id: 3,
              time: Date.now() - 1300012,
              text: 'Example text message 3.',
              sender: {
                id: 2,
                name: 'Sender 2'
              }
            },
            {
              id: 2,
              time: Date.now() - 2300340,
              text: 'Example text message 2.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
            {
              id: 1,
              time: Date.now() - 3000430,
              text: 'Example text message 1.1.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
          ]
        },
        'Room 2': {
          channel: null,
          messages: [
            {
              id: 2,
              time: Date.now() - 6000320,
              text: 'Example text message 2.',
              sender: {
                id: 3,
                name: 'Sender 3'
              }
            },
            {
              id: 1,
              time: Date.now() - 6500230,
              text: 'Example text message 1.2.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
          ]
        },
        'Room 3': {
          channel: null,
          messages: [
            {
              id: 6,
              time: Date.now() - 30000450,
              text: 'Example text message 6. Example text message 6. Example text message 6. Example text message 6.',
              sender: {
                id: 4,
                name: 'Sender 4'
              }
            },
            {
              id: 5,
              time: Date.now() - 30300450,
              text: 'Example text message 5.',
              sender: {
                id: 4,
                name: 'Sender 4'
              }
            },
            {
              id: 4,
              time: Date.now() - 30500086,
              text: 'Example text message 4.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
            {
              id: 3,
              time: Date.now() - 3060880,
              text: 'Example text message 3.',
              sender: {
                id: 4,
                name: 'Sender 4'
              }
            },
            {
              id: 2,
              time: Date.now() - 31200150,
              text: 'Example text message 2.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 1,
              time: Date.now() - 31300250,
              text: 'Example text message 1.3.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
          ],
        },
      },

      // Create a live websocket connection to the message server.
      connection: this.connect()
    }

    // Make sure that we bind the send methods that we pass to the child
    // components to the state of this component.
    this.connect = this.connect.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
    this.currentRoomMessages = this.currentRoomMessages.bind(this)
    this.currentRoom = this.currentRoom.bind(this)
    this.newMessageID = this.newMessageID.bind(this)
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
    channel.join().receive('ok', () => {

      // Forward chat messages to the receive message method.
      channel.on('message', data => {
        console.log(data)

        // Process receiving the message.
        this.receiveMessage(name, {
          text: data.message.text,
          sender: data.message.sender,

          // Use the server provided time and message id.
          time: data.time,
          id: data.id,
        });
      })
    })

    // Add the new room to our state.
    this.setState(state => { return {
      rooms: Object.assign({}, state.rooms, {
        [name]: {
          channel,
          messages: []
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
   *  Method to construct a new message ID. We temporarily create them
   *  client-side.
   *  @returns {Number}
   */
  newMessageID () {

    // Get the messages from the current room.
    const messages = this.currentRoomMessages()

    // Find the greatest id of any message in the current room.
    const greatestId = messages.reduce((id, message) => {

      // Replace the accumulator with any id that is greater.
      return id > message.id ? id : message.id

    // Start at zero.
    }, 0);

    // Add one to get the new id.
    return greatestId + 1
  }

  /**
   *  Method to send a message.
   *  @todo   This currently only updates state. Later on the message will have
   *          to come from the server to have a reliable ID.
   *  @param  {string}  text      Text of the new message to send.
   */
  sendMessage (text) {

    // Get the current room.
    const room = this.currentRoom()

    // Construc the new message object.
    const message = {
      id: this.newMessageID(),
      time: Date.now(),
      text,
      sender: this.state.currentSender,
    }

    // Send the message to the server.
    room.channel.push("new_message", { message })
  }

  /**
   *  Message to process receiving a new message.
   *  @param  {string}  roomName  Name of the chat room in which a message is
   *                              received.
   *  @param  {Object}  message   Received message object.
   *    @property {Number}  id      Unique message identifier.
   *    @property {Date}    time    Message timestamp.
   *    @property {string}  text    Message text.
   *    @property {Object}  sender  Sender of the message.
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

              // Add the new message to the beginning of the array.
              message,

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
    this.setState({
      currentRoom: name
    })
  }

  /**
   *  Method called when the React app has been mounted.
   */
  componentDidMount () {
    
    // Join the initial lobby room.
    this.joinRoom('Room 4')
    this.joinRoom('Room 5')
  }

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
            currentSender={this.state.currentSender}
            sendMessage={this.sendMessage}
          />
        </main>
      </div>
    )
  }
}
