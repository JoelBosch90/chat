// Import React dependencies.
import React, { useRef, useEffect, useCallback } from 'react'

// Import store dependencies.
import { useSelector, useDispatch } from 'react-redux'
import { userUpdated } from '../../store/features/rooms'

// Import used scripts.
import { uniqueMessages } from '../../scripts/rooms'

// Import components.
import ChatBoxControls from './Box/Controls'
import ChatBoxMessage from './Box/Message'
import ChatBoxInput from './Box/Input'
import Overlay from '../Overlay'

// Import styles.
import styles from './Box.module.scss'

/**
 *  Functional component that displays the chat box element that contains all
 *  interface elements to interact with a single chat room. It contains the
 *  previously sent messages in a single room and contains all interface
 *  elements to interact with that room.
 *  @returns  {JSX.Element}
 */
export default function ChatBox() {

  // Create references to set the correct focus.
  const [ overlayRef, inputRef ] = [ useRef(), useRef() ]

  // Create the dispatch function to interact with the store.
  const dispatch = useDispatch()

  // Get access to the variables we need from the store.
  const currentRoomName = useSelector(state => state.currentRoomName)
  const senderName = useSelector(state => state.rooms[currentRoomName]?.senderName || '')
  const messages = useSelector(state => state.rooms[currentRoomName]?.messages || '')
  const senderId = useSelector(state => state.senderId)

  /**
   *  Function to update the sender name in the current room.
   *  @param  {string}  name    New user name to install.
   */
  const updateSenderName = useCallback(name => {
    dispatch(userUpdated({
      roomName: currentRoomName,
      id: senderId,
      name,
    }))
  }, [dispatch, currentRoomName, senderId])

  /**
   *  Function to refocus the correct input.
   */
  const reFocus = useCallback(() => {

    // If we already have a sender name, we can focus the chat input.
    if (senderName) inputRef.current.focus()

    // Otherwise, the overlay is visible to get a sender name first. We should
    // focus that instead.
    else overlayRef.current.focus()
  }, [senderName, inputRef, overlayRef])

  // Refocus the input element when the overlay becomes visible or is
  // specifically refocused.
  useEffect(reFocus, [currentRoomName, reFocus])
  
  // Create a list of unique chat message elements.
  const messageElements = messages ? messages.reduce(uniqueMessages, []).map(message => (
    <ChatBoxMessage
        key={message.id}
        self={message.self}
        text={message.text}
        time={message.time}
        senderName={message.senderName}
        senderId={message.senderId}
        senderHue={message.senderHue}
      />
    )) : []

  return (
    <section className={`${styles.box} ${currentRoomName ? '' : styles.hidden}`}>
      <Overlay
        visible={!senderName}
        title={`What should we call you in room '${currentRoomName}'?`}
        placeholder="E.g. John Malkovich..."
        button="Select name"
        onSubmit={updateSenderName}
        focusRef={overlayRef}
      />
      <ChatBoxControls />
      <div className={styles.messages}>
        {messageElements}
      </div>
      <ChatBoxInput
        focusRef={inputRef}
      />
    </section>
  )
}
