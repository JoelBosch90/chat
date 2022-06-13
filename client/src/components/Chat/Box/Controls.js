// Import React dependencies.
import React, { useContext, useCallback } from 'react'

// Import store dependencies.
import { useSelector, useDispatch } from 'react-redux'
import { roomSelected } from '../../../store/features/currentRoomName'
import { roomLeft, senderNameUpdated, userUpdated } from '../../../store/features/rooms'

// Import used scripts.
import { users } from '../../../scripts/rooms'
import share from '../../../scripts/generic/share'
import deleteStateProperty from '../../../scripts/generic/deleteStateProperty'

// Import used components.
import { ConnectionContext } from '../../ConnectionContextProvider'

// Import styles.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowLeft, faPenToSquare, faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import styles from './Controls.module.scss'

/**
 *  Functional component that displays the controls bar in a chat box.
 *  @returns  {JSX.Element}
 */
export default function ChatBoxControls() {

  // Create the dispatch function to interact with the store.
  const dispatch = useDispatch()

  // Get access to the current room name to show the user which room they're in
  // and to get access to the current room.
  const currentRoomName = useSelector(state => state.currentRoomName)

  // We don't need access to all of the rooms here. Just the current one.
  const currentRoom = useSelector(state => state.rooms ? state.rooms[currentRoomName] : undefined)

  // Get access to the sender id so we know which user in this room is the
  // current user.
  const senderId = useSelector(state => state.senderId)

  // Get access to the connection context. We need this to leave the room.
  const { channels, setChannels } = useContext(ConnectionContext)

  /**
   *  Function to find the users for the current room excluding the current
   *  user.
   *  @returns  {array}
   */
  const currentUsers = useCallback(() => users(currentRoom, senderId), [currentRoom, senderId])

  /**
   *  Function to reset the sender name for the current room.
   */
  const resetSenderName = useCallback(() => {
    
    // Update the user object for the current user in the current room.
    dispatch(userUpdated({ roomName: currentRoomName, id: senderId, name: null }))

    // Update the sender name in the current room.
    dispatch(senderNameUpdated({ roomName: currentRoomName, senderName: null }))
  }, [dispatch, currentRoomName, senderId])

  /**
   *  Function to deselect this room. This will not remove the room and the user
   *  will still keep receiving messages in this room.
   */
  const deselectRoom = useCallback(() => {

    // Select no room.
    dispatch(roomSelected(''))
    
    // Go back to the root URL.
    window.history.pushState({}, '', '/')
  }, [dispatch])

  /**
   *  Function to leave this room. This will also remove the room, all of its
   *  history, and stop receiving messages in this room.
   */
  const leaveRoom = useCallback(() => {

    // Remember the current room name.
    const roomName = currentRoomName

    // Deselect the current room.
    deselectRoom()

    // Leave the channel for this room if it has one.
    channels[roomName]?.leave()

    // Remove both the room and the channel.
    dispatch(roomLeft(roomName))
    deleteStateProperty(roomName, setChannels)
  }, [dispatch, deselectRoom, channels, setChannels, currentRoomName])
  
  // Create a special span to display each user's name with their assigned
  // color.
  const online = currentUsers().map(user => (
    <span
      key={user.id}
      className={styles.user}
      style={{ '--user-hue': user.hue }}
      title={user.id}
    >
      {user.name}
    </span>
  ))

  return (
    <header className={styles.controls}>
      <div className={styles.top}>
        <div className={styles.start}>
          <button title="To overview" className={styles.mobile} onClick={deselectRoom}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <span title={currentRoomName} className={styles.name}>{currentRoomName}</span>
        </div>
        <div className={styles.end}>
          <button title="Share room" onClick={share}>
            <FontAwesomeIcon icon={faShareFromSquare} />
          </button>
          <button title="Change name" onClick={resetSenderName}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button title="Leave room" onClick={leaveRoom}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.online}>
          { online }
        </span>
      </div>
    </header>
  )
}
