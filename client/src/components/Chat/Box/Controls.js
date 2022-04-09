import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowLeft, faPenToSquare, faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import styles from './Controls.module.scss'

/**
 *  Functional component that displays the controls bar in a chat box.
 * 
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function ChatBoxControls(props) {

  // Extract the props that we want to use.
  const { roomName, deselectRoom, leaveRoom, rename } = props
  
  return (
    <header className={styles.controls}>
      <span className={styles.group}>
        <button title="To overview" className={styles.mobile} onClick={deselectRoom}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className={styles.name}>{roomName}</span>
      </span>
      <span className={styles.group}>
        <button title="Share room">
          <FontAwesomeIcon icon={faShareFromSquare} />
        </button>
        <button title="Change name" onClick={rename}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button title="Leave room" onClick={leaveRoom}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </span>
    </header>
  )
}
