import React from 'react'
import ChatBoxInput from './ChatBoxInput.js'
import ChatBoxMessage from './ChatBoxMessage.js'
import './ChatBox.scss'

export default class ChatBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

      // Provide some placeholder data.
      // @todo: get actual chat groups to display.
      messages: [
        {
          id: 0,
          sent: false,
        },
        {
          id: 1,
          sent: true,
        },
        {
          id: 2,
          sent: false,
        },
        {
          id: 3,
          sent: false,
        },
        {
          id: 4,
          sent: true,
        }
      ]
    }
  }
  
  render () {

    // Create a list of chat messages.
    const messages = this.state.messages.map((message) => {
      return <ChatBoxMessage
        key={message.id}
        sent={message.sent}
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
