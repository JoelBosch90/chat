import React from 'react'
import ChatNavigationRoom from './Navigation/Room.js'
import Overlay from '../Overlay.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './Navigation.scss'

export default class ChatNavigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: props.value || '',
      showOverlay: false,
    }

    // Make sure that we bind all methods that are shared with other components
    // to this component so that they keep access to this component's state.
    for(const method of [
      'showOverlay', 'hideOverlay'
    ]) this[method] = this[method].bind(this)
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
          <ChatNavigationRoom
            selected={name === this.props.currentRoom}
            name={name}
            messages={room.messages}
            onClick={() => this.props.selectRoom(name)}
          />
        </li>
      )
    }

    return (
      <nav className="chat-navigation">
        <Overlay
          visible={this.state.showOverlay}
          title="Which room do you want to join?"
          placeholder="E.g. Lobby 1..."
          button="Join"
          onSubmit={room => this.joinRoom(room)}
          onCancel={this.hideOverlay}
        />
        <ol>
          {rooms}
        </ol>
        <div className="chat-navigation-buttons">
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
