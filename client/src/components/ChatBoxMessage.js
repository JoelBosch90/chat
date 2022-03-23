import React from 'react'
import './ChatBoxMessage.scss'

export default function ChatBoxMessage(props) {
  
  // Format the time.
  const time = new Date(props.time)
  const hours = ("0" + time.getHours()).slice(-2)
  const minutes = ("0" + time.getMinutes()).slice(-2)
  const timeStamp = `${hours}:${minutes}`

  return (
    <div className={`chatbox-message${props.self ? ' self' : ''}`}>
      <div className="chatbox-message-toprow">
        <span className="chatbox-message-sender">{props.sender}</span>
        <span>{timeStamp}</span>
      </div>
      <div className="chatbox-message-bottomrow">
        <span>{props.text}</span>
      </div>
    </div>
  )
}
