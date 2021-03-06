import React from 'react'
import TimeStamp from '../../TimeStamp.js'
import styles from './Message.module.scss'

/**
 *  Functional component that displays a single message in a chat box.
 * 
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function ChatBoxMessage(props) {

  // Extract the props that we want to use.
  const { time, self, senderName, senderId, senderHue, text } = props
  
  return (
      <div className={`${styles.message} ${self ? styles.self : ''}`}>
        <div className={styles.top}>
          <span
            className={styles.sender}
            title={senderId}
            style={{ '--user-hue': senderHue }}
          >
            {senderName}
          </span>
          <span className={styles.time}><TimeStamp time={time} /></span>
        </div>
        <div className={styles.bottom}>
          <span>{text}</span>
        </div>
      </div>
  )
}
