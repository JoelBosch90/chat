import React from 'react'
import './ChatRoom.scss'

export default function ChatRoom(props) {

  // Process the last message.
  const last = props.messages.at(0)
  const lastSender = last ? last.senderName : ''
  const lastText = last ? last.text : ''
  const lastTime = last ? new Date(last.time) : undefined
  const lastHours = lastTime ? ("0" + lastTime.getHours()).slice(-2) : ''
  const lastMinutes = lastTime ? ("0" + lastTime.getMinutes()).slice(-2) : ''
  const lastTimeStamp = lastMinutes ? `${lastHours}:${lastMinutes}` : ''

  return (
    <button
      className={`chatroom${props.selected ? ' selected' : ''}`}
      onClick={props.onClick}
    >
      <div className="chatroom-top">
        <span className="chatroom-name">{props.name}</span>
        <span className="chatroom-time">{lastTimeStamp}</span>
      </div>
      <div className="chatroom-bottom">
        <span className="chatroom-sender">{lastSender}{lastText ? ':' : ''}</span>
        <span className="chatroom-text">{lastText}</span>
      </div>
    </button>
  )
}
