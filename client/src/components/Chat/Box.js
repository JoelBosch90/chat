import React, { useRef, useEffect } from 'react'
import ChatBoxControls from './Box/Controls.js'
import ChatBoxMessage from './Box/Message.js'
import ChatBoxInput from './Box/Input.js'
import Overlay from '../Overlay.js'
import styles from './Box.module.scss'

/**
 *  Functional component that displays the chat box element that contains all
 *  interface elements to interact with a single chat room. It contains the
 *  previously sent messages in a single room and contains all interface
 *  elements to interact with that room.
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default React.memo(function ChatBox(props) {

  // Extract the props that we want to use.
  const { messages, senderName, roomName, updateName, sendMessage, deselectRoom, leaveRoom, renameSender } = props

  // Create references to set the correct focus.
  const [ overlayRef, inputRef] = [ useRef(), useRef() ]

  console.log('Box', roomName, messages)

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

  /**
   *  Function to refocus the correct input.
   */
  const reFocus = () => {

    // If we already have a sender name, we can focus the chat input.
    if (senderName) inputRef.current.focus()

    // Otherwise, the overlay is visible to get a sender name first. We should
    // focus that instead.
    else overlayRef.current.focus()
  }

  /**
   *  Function to refocus before sending a message.
   *  @param    {...any}    args    Catch any possible arguments.
   *  @returns  {any}
   */
  const sendAndFocus = (...args) => {

    // First refocus the input as we may have lost it if the user clicked the
    // button.
    reFocus()

    // Now send the message as usual.
    return sendMessage(...args)
  }

  // Refocus the input element when the overlay becomes visible or is
  // specifically refocused.
  useEffect(reFocus, [roomName, senderName, inputRef, overlayRef])

  return (
    <section className={`${styles.box} ${roomName ? '' : styles.hidden}`}>
      <Overlay
        visible={!senderName}
        title={`What should we call you in room '${roomName}'?`}
        placeholder="E.g. John Malkovich..."
        button="Select name"
        onSubmit={updateName}
        focusRef={overlayRef}
      />
      <ChatBoxControls 
        roomName={roomName}
        deselectRoom={deselectRoom}
        leaveRoom={leaveRoom}
        renameSender={renameSender}
      />
      <div className={styles.messages}>
        {messageElements}
      </div>
      <ChatBoxInput
        sendMessage={sendAndFocus}
        roomName={roomName}
        focusRef={inputRef}
      />
    </section>
  )
})
