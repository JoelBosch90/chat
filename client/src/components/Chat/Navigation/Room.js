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
export default function ChatNavigationRoom(props) {

  // Extract the props that we want to use.
  const { messages, selected, onClick, name } = props

  // Process the last message.
  const last = messages ? messages.at(0) : null
  const lastSender = last ? last.senderName : ''
  const lastText = last ? last.text : ''

  return (
    <button
      className={`${styles.room} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.top}>
        <span className={styles.name}>{name}</span>
        <TimeStamp className={styles.timer} time={last ? new Date(last.time) : undefined } />
      </div>
      <div className={styles.bottom}>
        <span className={styles.sender}>{lastSender}{lastText ? ':' : ''}</span>
        <span className={styles.text}>{lastText}</span>
      </div>
    </button>
  )
}
