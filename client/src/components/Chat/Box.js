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
  const { roomName, messages, users, senderName, updateName, sendMessage, deselectRoom, leaveRoom, renameSender } = props

  // Create references to set the correct focus.
  const [ overlayRef, inputRef] = [ useRef(), useRef() ]

  /**
   *  Helper function that adds a new message only if it is not already present
   *  in the provided array of messages.
   *  @param    {array}   messages      List of message.
   *  @param    {Object}  newMessage    New message that is added only if it is
   *                                    not already present.
   *  @returns  {array}
   */
  const uniqueMessages = (messages, newMessage) => {

    // Check if a message with this ID already exists in this array. If so, we
    // don't add the new one.
    if (messages.find(oldMessage => oldMessage.id === newMessage.id)) return messages

    // Otherwise, we add the new one.
    return [ ...messages, newMessage ]
  }
  
  // Create a list of unique chat message elements.
  const messageElements = messages ? messages.reduce(uniqueMessages, []).map(message => {
    return <ChatBoxMessage
      key={message.id}
      self={message.self}
      text={message.text}
      time={message.time}
      senderName={message.senderName}
      senderId={message.senderId}
      senderHue={message.senderHue}
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
        users={users}
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
