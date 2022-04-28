import React from 'react'
import TimeStamp from '../../TimeStamp.js'
import styles from './Room.module.scss'

/**
 *  Functional component that displays a single room in the chat navigation and
 *  acts like a button that users can click.
 * 
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default React.memo(function ChatNavigationRoom(props) {

  // Extract the props that we want to use.
  const { messages, selected, onClick, name } = props

  // Process the last message.
  const last = messages ? messages.at(0) : null
  const lastSenderHue = last ? last.senderHue : 0
  const lastSender = last ? last.senderName : ''
  const lastText = last ? last.text : ''

  return (
    <button
      className={`${styles.room} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.top}>
        <span className={styles.name}>{name}</span>
        <span className={styles.time}><TimeStamp time={last ? new Date(last.time) : undefined } /></span>
      </div>
      <div className={styles.bottom}>
        <span className={styles.sender} style={{ '--user-hue': lastSenderHue }}>{lastSender}{lastText ? ':' : ''}</span>
        <span className={styles.text}>{lastText}</span>
      </div>
    </button>
  )
})
