import React from 'react'
import ChatBoxInput from './Box/Input.js'
import ChatBoxMessage from './Box/Message.js'
import Overlay from '../Overlay.js'
import './Box.scss'

export default class ChatBox extends React.Component {
  /**
   *  Method called to render the component.
   *  @returns {JSX.Element}
   */
  render () {

    // Create a list of chat messages.
    const messages = this.props.messages.map((message) => {
      return <ChatBoxMessage
        key={message.id}
        self={message.self}
        text={message.text}
        time={message.time}
        sender={message.senderName}
      />
    })

    return (
      <section className="chat-box">
        <Overlay
          visible={!this.props.senderName}
          title={`What should we call you in room '${this.props.roomName}'?`}
          placeholder="E.g. John Malkovich..."
          button="Select name"
          onSubmit={this.props.updateName}
        />
        <div className="chat-box-messages">
          {messages}
        </div>
        <ChatBoxInput
          sendMessage={this.props.sendMessage}
          roomName={this.props.roomName}
        />
      </section>
    )
  }
}
