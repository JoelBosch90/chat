import React from 'react'
import styles from './EmojiPicker.module.scss'

/**
 *  Functional component that displays a box that can be used to pick emoji's.
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function EmojiPicker(props) {

  // Extract the props that we want to use.
  const { pick } = props

  return (
    <div className={styles.emojipicker}>

    </div>
  )
}