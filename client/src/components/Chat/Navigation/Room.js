import React from 'react'
import './Room.scss'

export default function ChatNavigationRoom(props) {

  // Process the last message.
  const last = props.messages ? props.messages.at(0) : null
  const lastSender = last ? last.senderName : ''
  const lastText = last ? last.text : ''
  const lastTime = last ? new Date(last.time) : undefined
  const lastHours = lastTime ? ("0" + lastTime.getHours()).slice(-2) : ''
  const lastMinutes = lastTime ? ("0" + lastTime.getMinutes()).slice(-2) : ''
  const lastTimeStamp = lastMinutes ? `${lastHours}:${lastMinutes}` : ''

  return (
    <button
      className={`chat-navigation-room${props.selected ? ' selected' : ''}`}
      onClick={props.onClick}
    >
      <div className="chat-navigation-room-top">
        <span className="chat-navigation-room-name">{props.name}</span>
        <span className="chat-navigation-room-time">{lastTimeStamp}</span>
      </div>
      <div className="chat-navigation-room-bottom">
        <span className="chat-navigation-room-sender">{lastSender}{lastText ? ':' : ''}</span>
        <span className="chat-navigation-room-text">{lastText}</span>
      </div>
    </button>
  )
}
