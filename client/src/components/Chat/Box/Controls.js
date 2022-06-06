// Import used scripts.
import share from '../../../scripts/share'

// Import styles.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowLeft, faPenToSquare, faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import styles from './Controls.module.scss'

/**
 *  Functional component that displays the controls bar in a chat box.
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function ChatBoxControls(props) {

  // Extract the props that we want to use.
  const { roomName, users, deselectRoom, leaveRoom, renameSender } = props
  
  // Create a special span to display each user's name with their assigned
  // color.
  const online = users.map(user => (
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
          <span title={roomName} className={styles.name}>{roomName}</span>
        </div>
        <div className={styles.end}>
          <button title="Share room" onClick={share}>
            <FontAwesomeIcon icon={faShareFromSquare} />
          </button>
          <button title="Change name" onClick={renameSender}>
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
