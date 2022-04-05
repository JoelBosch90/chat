import React, { useState } from 'react'
import './Overlay.scss'

/**
 *  Functional component that can be used to display an overlay that displays a
 *  small form to ask for a single input value.
 * 
 *  It is possible to contain this overlay inside a container by setting
 *  'position:relative' on that container.
 * 
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function Overlay(props) {

  // Extract the props that we want to use.
  const { value, visible, placeholder, button, title, onSubmit, onCancel } = props

  // We're going to keep an internal value 
  const [input, setInput] = useState(value)
  
  /**
   *  Handler for keeping the React state up to date with the input.
   *  @param  {Event} event   The event to handle.
   */
  const change = (event) => { setInput(event.target.value) }

  /**
   *  Handler for submit events.
   *  @param  {Event} event   The event to handle.
   */
  const submit = (event) => {

    // Make sure that we do not reload the page.
    event.preventDefault();

    // Only call the on submit method when we have input to share.
    if (input) onSubmit(input)

    // Reset the input value.
    setInput('')
  }

  /**
   *  Method that processes a click on the cancel button.
   *  @param  {Event} event   The click event for the cancel button.
   */
  const cancel = (event) => {

    // Don't do anything if there is no cancel method installed.
    if (!onCancel) return;

    // Otherwise, call that cancel method.
    onCancel(event);
  }

  return (
    <form
      className={`overlay${visible ? '' : ' hidden'}`}
      onSubmit={submit}
    >
      <h1>{title}</h1>
      <input
        placeholder={placeholder}
        value={input}
        onChange={change}
        autoFocus
        key={visible}
      />
      <button>{button}</button>
      <button
        className={onCancel ? '' : ' hidden'}
        onClick={cancel}
      >
        Cancel
      </button>
    </form>
  )
}
