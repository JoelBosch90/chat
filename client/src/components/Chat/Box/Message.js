import React from 'react'
import './Message.scss'

export default function ChatBoxMessage(props) {
  
  // Format the time.
  const time = new Date(props.time)
  const hours = ("0" + time.getHours()).slice(-2)
  const minutes = ("0" + time.getMinutes()).slice(-2)
  const timeStamp = `${hours}:${minutes}`

  return (
    <div className={`chat-box-message${props.self ? ' self' : ''}`}>
      <div className="chat-box-message-toprow">
        <span className="chat-box-message-sender">{props.sender}</span>
        <span>{timeStamp}</span>
      </div>
      <div className="chat-box-message-bottomrow">
        <span>{props.text}</span>
      </div>
    </div>
  )
}
