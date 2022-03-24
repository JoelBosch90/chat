import React from 'react'
import ChatBoxInput from './ChatBoxInput.js'
import ChatBoxMessage from './ChatBoxMessage.js'
import OverlayInput from './OverlayInput.js'
import './ChatBox.scss'

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
      <section className="chatbox">
        <OverlayInput
          visible={!this.props.senderName}
          title="What should we call you in this room?"
          placeholder="E.g. John Malkovich..."
          button="Select"
          onSubmit={this.props.updateName}
        />
        <div className="chatbox-messages">
          {messages}
        </div>
        <ChatBoxInput
          sendMessage={this.props.sendMessage}
        />
      </section>
    )
  }
}
