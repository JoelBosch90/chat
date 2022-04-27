import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowLeft, faPenToSquare, faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import share from '../../../scripts/share.js'
import styles from './Controls.module.scss'

/**
 *  Functional component that displays the controls bar in a chat box.
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default React.memo(function ChatBoxControls(props) {

  // Extract the props that we want to use.
  const { roomName, deselectRoom, leaveRoom, renameSender } = props
  
  return (
    <header className={styles.controls}>
      <span className={styles.start}>
        <button title="To overview" className={styles.mobile} onClick={deselectRoom}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span title={roomName} className={styles.name}>{roomName}</span>
      </span>
      <span className={styles.end}>
        <button title="Share room" onClick={share}>
          <FontAwesomeIcon icon={faShareFromSquare} />
        </button>
        <button title="Change name" onClick={renameSender}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button title="Leave room" onClick={leaveRoom}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </span>
    </header>
  )
})
