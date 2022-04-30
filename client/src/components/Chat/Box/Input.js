import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faFaceGrinBeam } from '@fortawesome/free-solid-svg-icons'
import EmojiPicker from './Input/EmojiPicker.js'
import styles from './Input.module.scss'

/**
 *  Functional component that displays the input field in a chat box that is
 *  used to send new messages.
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function ChatBoxInput(props) {

  // Extract the props that we want to use.
  const { value, sendMessage, focusRef } = props

  // We're going to keep an internal value for the input. Default to a string
  // so that we can set up a controlled component.
  const [ input, setInput ] = useState(value || '')

  // Keep track of when we should show the emoji picker.
  const [ showingEmojiPicker, showEmojiPicker ] = useState(false)

  /**
   *  Handler for keeping the React state up to date with the input.
   *  @param  {Event} event The event to handle.
   */
  const change = event => void setInput(event.target.value)

  /**
   *  Handler for submit events.
   *  @param  {Event} event The event to handle.
   */
  const submit = event => {

    // Make sure that we do not reload the page.
    event.preventDefault()

    // Only send a message if there's something to send.
    if (input) sendMessage(input)

    // Reset the input value.
    setInput('')
  }

  /**
   *  Function to add text to the current input.
   *  @param  {string}  text  The text to add to the input.
   */
  const addToInput = text => setInput(input => `${input}${text}`)

  /**
   *  Function to toggle showing the emoji picker.
   */
  const toggleEmojiPicker = () => showEmojiPicker(showing => !showing)

  return (
    <form className={styles.input} onSubmit={submit}>
      <div className={`${styles.top} ${showingEmojiPicker ? '' : styles.hidden}`}>
        <EmojiPicker pick={addToInput} />
      </div>
      <div className={styles.bottom}>
        <button type='button' onClick={toggleEmojiPicker}>
          <FontAwesomeIcon icon={faFaceGrinBeam} />
        </button>
        <input
          ref={focusRef}
          placeholder="Write a message..."
          value={input}
          onChange={change}
        />
        <button>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </form>
  )
}