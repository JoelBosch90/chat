import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import styles from './Input.module.scss'

/**
 *  Functional component that displays the input field in a chat box that is
 *  used to send new messages.
 * 
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function ChatBoxInput(props) {

  // Extract the props that we want to use.
  const { value, roomName, sendMessage } = props

  // We're going to keep an internal value for the input.
  const [input, setInput] = useState(value)

  /**
   *  Handler for keeping the React state up to date with the input.
   *  @param  {Event} event The event to handle.
   */
  const change = event => { setInput(event.target.value) }

  /**
   *  Handler for submit events.
   *  @param  {Event} event The event to handle.
   */
  const submit = event => {

    // Make sure that we do not reload the page.
    event.preventDefault();

    // Only send a message if there's something to send.
    if (input) sendMessage(input)

    // Reset the input value.
    setInput('')
  }
  
  return (
    <form className={styles.input} onSubmit={submit}>
      <input
        placeholder="Write a message..."
        value={input}
        onChange={change}
        autoFocus
        key={roomName}
      />
      <button>
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  )
}