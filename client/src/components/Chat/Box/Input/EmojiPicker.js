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

  // This is a list of the (hexadecimal) ranges of all emoji categories.
  const ranges = [
    [128513, 128591], // Emoticons.
    [128640, 128704], // Transport and map symbols.
    [127744, 128278], // Miscellaneous.
    [9986, 10160], // Dingbats.
  ]

  // Create a list of all emoji categories.
  const categories = []

  // Loop through all different categories.
  for (const category of ranges) {

    // Create a list of emoji as buttons.
    const buttons = []

    // Loop through all emoji values.
    for (let code = category[0]; code < category[1]; code++) {

      // Construct the emoji unicode character.
      const emoji = String.fromCodePoint(code)

      // Add each emoji as a button that picks itself.
      buttons.push((
        <button
          key={emoji}
          type='button'
          onClick={() => pick(emoji)}
          role='img'
        >
          {emoji}
        </button>
      ))
    }

    // Add each category as a separate div.
    categories.push((
      <div key={category[0]}>
        {buttons}
      </div>
    ))
  }

  return (
    <div className={styles.emojipicker}>
      {categories}
    </div>
  )
}