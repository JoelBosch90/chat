import React from 'react'
import './OverlayInput.scss'

export default class OverlayInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: props.value || '',
    }

    // Make sure that we bind all methods that are shared with other components
    // to this component so that they keep access to this component's state.
    for(const method of [
      'change', 'submit', 'cancel'
    ]) this[method] = this[method].bind(this)
  }

  /**
   *  Handler for keeping the React state up to date with the input.
   *  @param  {Event} event   The event to handle.
   */
  change(event) {
    this.setState({ input: event.target.value })
  }

  /**
   *  Handler for submit events.
   *  @param  {Event} event   The event to handle.
   */
  submit(event) {

    // Make sure that we do not reload the page.
    event.preventDefault();

    // Only call the on submit method when we have some input to share.
    if (this.state.input) this.props.onSubmit(this.state.input)

    // Reset the input value.
    this.setState({ input: '' })
  }

  /**
   *  Method that processes a click on the cancel button.
   *  @param  {Event} event   The click event for the cancel button.
   */
  cancel (event) {

    // Don't do anything if there is no cancel method installed.
    if (!this.props.onCancel) return;

    // Otherwise, call that cancel method.
    this.props.onCancel(event);
  }

  /**
   *  Method called to render the component.
   *  @returns {JSX.Element}
   */
  render () {
    return (
      <form
        className={`overlay-input${this.props.visible ? '' : ' hidden'}`}
        onSubmit={this.submit}
      >
        <h1>{this.props.title}</h1>
        <input
          placeholder={this.props.placeholder}
          value={this.state.input}
          onChange={this.change}
          autoFocus
          key={this.props.visible}
        />
        <button>{this.props.button}</button>
        <button
          className={this.props.onCancel ? '' : ' hidden'}
          onClick={this.cancel}
        >
          Cancel
        </button>
      </form>
    )
  }
}
