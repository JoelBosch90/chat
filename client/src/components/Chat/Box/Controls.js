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
  const { roomName, leaveRoom } = props
  
  return (
    <header className={styles.controls}>
      <span className={styles.group}>
        <button className={styles.mobile} onClick={leaveRoom}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className={styles.name}>{roomName}</span>
      </span>
      <span className={styles.group}>
        <button>
          <FontAwesomeIcon icon={faShareFromSquare} />
        </button>
        <button>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </span>
    </header>
  )
}
