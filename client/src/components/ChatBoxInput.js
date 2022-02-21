import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './ChatBoxInput.scss'

export default class ChatBoxInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
    }

    this.change = this.change.bind(this)
    this.submit = this.submit.bind(this)
  }

  /**
   *  Handler for keeping the react state up to date with the input.
   *  @param  {Event} event The event to handle.
   */
  change(event) {
    this.setState({ input: event.target.value })
  }

  /**
   *  Handler for submit events.
   *  @param  {Event} event The event to handle.
   */
  submit(event) {

    // Make sure that we do not reload the page.
    event.preventDefault();

    // Only send a message if there's something to send.
    if (this.state.input) this.props.sendMessage(this.state.input)

    // Reset the input value.
    this.setState({ input: '' })
  }

  render () {
    return (
      <form className="chatbox-input" onSubmit={this.submit}>
        <input
          placeholder="Write a message..."
          value={this.state.input}
          onChange={this.change}
        />
        <button>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    )
  }
}
