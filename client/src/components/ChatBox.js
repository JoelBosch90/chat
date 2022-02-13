import React from 'react'
import ChatBoxInput from './ChatBoxInput.js'
import ChatBoxMessage from './ChatBoxMessage.js'
import './ChatBox.scss'

export default class ChatBox extends React.Component {
  render () {

    // Create a list of chat messages.
    const messages = this.props.messages.map((message) => {
      return <ChatBoxMessage
        key={message.id}
        sent={message.sender.id === this.props.currentSender.id}
        text={message.text}
        time={message.time}
        sender={message.sender.name}
      />
    })

    return (
      <div className="chatbox">
        <div className="chatbox-messages">
          {messages}
        </div>
        <ChatBoxInput />
      </div>
    )
  }
}
