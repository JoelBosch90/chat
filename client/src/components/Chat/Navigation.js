import React, { useState } from 'react'
import ChatNavigationRoom from './Navigation/Room.js'
import Overlay from '../Overlay.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import styles from './Navigation.module.scss'


/**
 *  Functional component that displays a vertical navigation layout of
 *  chatrooms, allows a user to navigate between chatrooms, and join new
 *  chatrooms.
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function ChatNavigation(props) {

  // Extract the props that we want to use.
  const { rooms, currentRoom, selectRoom } = props

  // We're going to keep an internal value for when we want to show the overlay.
  const [ overlayVisible, setOverlayVisible ] = useState(false)

  /**
   *  Method to show the overlay.
   */
  const showOverlay = () => void setOverlayVisible(true)

  /**
   *  Method to hide the overlay.
   */
  const hideOverlay = () => void setOverlayVisible(false)

  /**
   *  Method to join a new room.
   *  @param  {string}  room  The name of the room to join.
   */
  const join = room => {

    // Call the prop method to actually join the room.
    selectRoom(room)

    // Hide the overlay again.
    hideOverlay()
  }

  // Initialize a list of chat room elements.
  const roomElements = rooms ? Object.entries(rooms).map(([name, room]) => {
    return (
      <li key={name} >
        <ChatNavigationRoom
          selected={name === currentRoom}
          name={name}
          messages={room.messages}
          onClick={() => selectRoom(name)}
        />
      </li>
    )
  }) : []

  return (
    <nav className={styles.navigation}>
      <Overlay
        visible={overlayVisible}
        title="Which room do you want to join?"
        placeholder="E.g. Lobby 1..."
        button="Join"
        onSubmit={join}
        onCancel={hideOverlay}
      />
      <ol>
        {roomElements}
      </ol>
      <div className={styles.buttons}>
        <button
          title="Join room"
          onClick={showOverlay}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </nav>
  )
}