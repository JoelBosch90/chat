// Import React dependencies.
import { useRef, useState, useContext, useCallback } from 'react'

// Import store dependencies.
import { useSelector } from 'react-redux'

// Import components.
import { ConnectionContext } from '../../ConnectionContextProvider'
import EmojiPicker from './Input/EmojiPicker'

// Import styles.
import styles from './Input.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faFaceGrinBeam } from '@fortawesome/free-solid-svg-icons'

/**
 *  Functional component that displays the input field in a chat box that is
 *  used to send new messages.
 *  @param    {Object}  props   React props passed by the parent element.
 *    @property {Object}  focusRef  Optional ref to access the input element.
 *  @returns  {JSX.Element}
 */
export default function ChatBoxInput(props = {}) {

  // Use the focus ref from the props if it was provided, otherwise we need a
  // new ref to use. This makes it an option for a parent component to set the
  // focus on our input element. In proper React, we'd use a prop for this, but
  // we might want to set focus repeatedly and we're not really toggling
  // anything so it does not make sense to rely on a state for this.
  // Also note that we cannot call useRef() conditionally, so we always need to
  // declare the interal ref as well.
  const internalRef = useRef()
  const focusRef = props.focusRef || internalRef

  // Get access to the name of the currently selected room, and the rooms object
  // that contains the messages of which we want to show the latest.
  const currentRoomName = useSelector(state => state.currentRoomName)
  const currentRoom = useSelector(state => state.rooms ? state.rooms[currentRoomName] : undefined)

  // We need access to the current room's channel to send a message to the right
  // place.
  const { channels } = useContext(ConnectionContext)
  
  /**
   *  Function to send a message.
   *  @param  {string}  text    Text of the new message to send.
   */
  const sendMessage = useCallback(text => {

    // First refocus the input as we may have lost it if the user clicked the
    // button.
    focusRef.current.focus()

    // We do need a room, otherwise we cannot send anything.
    if (!currentRoom) return

    // Use the channel for the current room to send the message and the current
    // name of the sender to the server.
    channels[currentRoomName].push("new_message", {
      text,
      sender_name: currentRoom.senderName
    })
  }, [currentRoom, currentRoomName, channels, focusRef])


  // We're going to keep an internal value for the input. Default to a string
  // so that we can set up a controlled component.
  const [ input, setInput ] = useState('')

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
    <form
      className={styles.input}
      onSubmit={submit}
      autoComplete="off"
    >
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