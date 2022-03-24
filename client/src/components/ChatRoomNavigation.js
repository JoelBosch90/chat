import React from 'react'
import ChatRoom from './ChatRoom.js'
import OverlayInput from './OverlayInput.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ChatRoomNavigation.scss'

export default class ChatRoomNavigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: props.value || '',
      showOverlay: false,
    }

    // Bind the methods to this component.
    this.joinRoom = this.joinRoom.bind(this)
    this.showOverlay = this.showOverlay.bind(this)
    this.hideOverlay = this.hideOverlay.bind(this)
  }

  /**
   *  Method to join a new room.
   *  @param  {string}  room  The name of the room to join.
   */
  joinRoom (room) {

    // Call the prop method to actually join the room.
    this.props.joinRoom(room)

    // Hide the overlay again.
    this.setState({ showOverlay: false })
  }

  /**
   *  Method to show the overlay.
   */
  showOverlay () { this.setState({ showOverlay: true }) }

  /**
   *  Method to hide the overlay.
   */
  hideOverlay () { this.setState({ showOverlay: false }) }

  /**
   *  Method called to render the component.
   *  @returns {JSX.Element}
   */
  render () {

    // Initialize a list of chat room elements.
    const rooms = []

    // Fill the list.
    for(const [name, room] of Object.entries(this.props.rooms)) {
      rooms.push(
        <li key={name} >
          <ChatRoom
            selected={name === this.props.currentRoom}
            name={name}
            messages={room.messages}
            onClick={() => this.props.selectRoom(name)}
          />
        </li>
      )
    }

    return (
      <nav className="chatroom-navigation">
        <OverlayInput
          visible={this.state.showOverlay}
          title="Enter the name of the lobby"
          placeholder="E.g. Lobby 1..."
          button="Join"
          onSubmit={room => this.joinRoom(room)}
          onCancel={this.hideOverlay}
        />
        <ol>
          {rooms}
        </ol>
        <div className="chatroom-navigation-buttons">
          <button
            onClick={this.showOverlay}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </nav>
    )
  }
}
