import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './ChatBoxInput.scss'

export default class ChatBoxInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: props.value || '',
    }

    // Make sure that we bind all methods that are shared with other components
    // to this component so that they keep access to this component's state.
    for(const method of [
      'change', 'submit'
    ]) this[method] = this[method].bind(this)
  }

  /**
   *  Handler for keeping the React state up to date with the input.
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

  /**
   *  Method called to render the component.
   *  @returns {JSX.Element}
   */
  render () {
    return (
      <form className="chatbox-input" onSubmit={this.submit}>
        <input
          placeholder="Write a message..."
          value={this.state.input}
          onChange={this.change}
          autoFocus
          key={this.props.roomName}
        />
        <button>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    )
  }
}
