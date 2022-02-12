import React from 'react'
import './ChatBoxMessage.scss'

export default function ChatBoxMessage(props) {
  return (
    <div className={`chatbox-message${props.sent ? ' sent' : ''}`}></div>
  )
}
