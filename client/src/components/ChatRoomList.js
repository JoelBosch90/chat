import React from 'react'
import ChatRoom from './ChatRoom.js'
import './ChatRoomList.scss'

export default class ChatRoomList extends React.Component {
  render () {

    // Initialize a list of chat room elements.
    const rooms = []

    // Fill the list.
    for(const [name, room] of Object.entries(this.props.rooms)) {
      rooms.push(
        <ChatRoom
          key={name}
          selected={name === this.props.currentRoom}
          name={name}
          messages={room.messages}
          onClick={() => this.props.selectRoom(name)}
        />
      )
    }

    return (
      <nav className="chatroom-list">
        <ol>
          {rooms}
        </ol>
      </nav>
    )
  }
}
