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

  /**
   *  Function to pick an emoji. This one also makes sure that emojis get added
   *  to the recently used emoji category.
   *  @param  {string}  emoji   Emoji to pick.
   */
  const pickEmoji = emoji => {

    // First process picking the emoji.
    pick(emoji)
  }

  /**
   *  Function to create an emoji button.
   *  @param    {string}  emoji   Emoji to create a button for.
   *  @returns  {JSX}
   */
  const createEmojiButton = emoji => (
    <button
      key={emoji}
      type='button'
      onClick={() => pickEmoji(emoji)}
      role='img'
    >
      {emoji}
    </button>
  )

  /**
   *  Function to create a category of emoji buttons.
   *  @param    {string}  name      Name of the category to add.
   *  @param    {array}   buttons   Emoji buttons to add to the category.
   *  @returns  {JSX}
   */
  const createEmojiCategory = (name, buttons) => (
    <div key ={name}>
      <h3>{name}</h3>
      <div className={styles.emojis}>
        {buttons}
      </div>
    </div>
  )

  // This is a list of the (hexadecimal) ranges of all emoji categories.
  const ranges = [
    { name: 'Emoticons', start: 128513, end: 128591 }, // Emoticons.
    { name: 'Symbols', start: 128640, end: 128704 }, // Transport and map symbols.
    { name: 'Miscellaneous', start: 127744, end: 128278 }, // Miscellaneous.
    { name: 'Dingbats', start: 9986, end: 10160 }, // Dingbats.
  ]

  // Create a list of all emoji categories.
  const categories = []

  // Loop through all different categories.
  for (const category of ranges) {

    // Create a list of emoji as buttons.
    const buttons = []

    // Loop through all emoji values.
    for (let code = category.start; code < category.end; code++) {

      // Construct the emoji unicode character.
      const emoji = String.fromCodePoint(code)

      // Add each emoji as a button that picks itself.
      buttons.push(createEmojiButton(emoji))
    }

    // Add each category.
    categories.push(createEmojiCategory(category.name, buttons))
  }

  return (
    <div className={styles.emojipicker}>
      {categories}
    </div>
  )
}