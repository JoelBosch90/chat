import React, { useState, useEffect, useRef } from 'react'
import styles from './Overlay.module.scss'

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
  const { visible, placeholder, button, title, onSubmit, onCancel, focusRef } = props

  // We're going to keep an internal value for the input.
  const [ input, setInput ] = useState('')

  // We may get a ref for the focus element from the props, but if that is not
  // the case, we'll need to create an internal ref that we can use to
  // reference the input element.
  const internalRef = useRef()

  // If we have a ref from the props, use that. If not, use our internal ref to
  // reference the input element.
  const inputRef = focusRef || internalRef
  
  /**
   *  Handler for keeping the React state up to date with the input.
   *  @param  {Event} event   The event to handle.
   */
  const change = event => void setInput(event.target.value)

  /**
   *  Handler for submit events.
   *  @param  {Event} event   The event to handle.
   */
  const submit = event => {

    // Make sure that we do not reload the page.
    event.preventDefault()

    // Only call the on submit method when we have input to share.
    if (input) onSubmit(input)

    // Reset the input value.
    setInput('')
  }

  /**
   *  Function that processes a click on the cancel button.
   *  @param  {Event} event   The click event for the cancel button.
   */
  const cancel = event => {

    // Don't do anything if no cancel method is installed.
    if (!onCancel) return

    // Otherwise, call that cancel method.
    onCancel(event)
  }

  // Refocus the input element when the overlay becomes visible or is
  // specifically refocused.
  useEffect(() => { if (visible) inputRef.current.focus() }, [visible, inputRef])

  return (
    <form
      className={`${styles.overlay} ${visible ? '' : styles.hidden}`}
      onSubmit={submit}
    >
      <h1>{title}</h1>
      <input
        ref={inputRef}
        placeholder={placeholder}
        value={input}
        onChange={change}
      />
      <button>{button}</button>
      <button
        className={onCancel ? '' : styles.hidden}
        onClick={cancel}
      >
        Cancel
      </button>
    </form>
  )
}
