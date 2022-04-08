import React from 'react'
import ChatBoxInput from './Box/Input.js'
import ChatBoxMessage from './Box/Message.js'
import Overlay from '../Overlay.js'
import styles from './Box.module.scss'

/**
 *  Functional component that displays the chat box element that contains all
 *  interface elements to interact with a single chat room. It contains the
 *  previously sent messages in a single room and contains all interface
 *  elements to interact with that room.
 * 
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function ChatBox(props) {

  // Extract the props that we want to use.
  const { messages, senderName, roomName, updateName, sendMessage } = props

  // Create a list of chat messages.
  const messageElements = messages ? messages.map(message => {
    return <ChatBoxMessage
      key={message.id}
      self={message.self}
      text={message.text}
      time={message.time}
      sender={message.senderName}
    />
  }) : []

  return (
    <section className={styles.box}>
      <Overlay
        visible={!senderName}
        title={`What should we call you in room '${roomName}'?`}
        placeholder="E.g. John Malkovich..."
        button="Select name"
        onSubmit={updateName}
      />
      <div className={styles.messages}>
        {messageElements}
      </div>
      <ChatBoxInput
        sendMessage={sendMessage}
        roomName={roomName}
      />
    </section>
  )
}
