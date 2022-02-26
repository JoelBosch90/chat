import React from 'react'
import './ChatGroup.scss'

export default function ChatGroup(props) {

  // Process the last message.
  const last = props.messages.at(0)
  const lastSender = last.sender.name
  const lastText = last.text
  const lastTime = new Date(last.time)
  const lastHours = ("0" + lastTime.getHours()).slice(-2)
  const lastMinutes = ("0" + lastTime.getMinutes()).slice(-2)
  const lastTimeStamp = `${lastHours}:${lastMinutes}`

  return (
    <button
      className={`chatgroup${props.selected ? ' selected' : ''}`}
      onClick={props.onClick}
    >
      <div className="chatgroup-top">
        <span className="chatgroup-name">{props.name}</span>
        <span className="chatgroup-time">{lastTimeStamp}</span>
      </div>
      <div className="chatgroup-bottom">
        <span className="chatgroup-sender">{lastSender}:</span>
        <span className="chatgroup-text">{lastText}</span>
      </div>
    </button>
  )
}
