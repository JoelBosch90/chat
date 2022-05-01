import React from 'react'
import styles from './EmojiPicker.module.scss'
import useLocalState from '../../../../hooks/useLocalState.js'

/**
 *  Functional component that displays a box that can be used to pick emoji's.
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function EmojiPicker(props) {

  // Extract the props that we want to use.
  const { pick } = props

  // Keep track of recently picked emojis. We need to store them in an array
  // because JSON does not handle sets well and we use JSON to locally store
  // our room objects.
  const [recentlyPicked, setRecentlyPicked] = useLocalState('recentlyPicked', [])

  /**
   *  Function to pick an emoji. This one also makes sure that emojis get added
   *  to the recently used emoji category.
   *  @param  {string}  emoji   Emoji to pick.
   */
  const pickEmoji = emoji => {

    // First process picking the emoji.
    pick(emoji)

    // Update the recently picked set in the local state.
    setRecentlyPicked(list => {

      // Create a local copy we can safely manipulate. We want to use a set to
      // make sure that we never show the same emoji twice in this list.
      const set = new Set(list)

      // Remove the emoji if it is already present. This makes sure that the
      // most recently picked emojis are always at the end of the set.
      if (set.has(emoji)) set.delete(emoji)

      // Add the emoji to the set and convert back to an array. We also want to
      // make sure we don't keep too long a list as that would obscure the rest
      // of the picker so we take only the latest.
      return Array.from(set.add(emoji)).slice(-10)
    })
  }

  /**
   *  Function to create an emoji button.
   *  @param    {string}  emoji   Emoji to create a button for.
   *  @returns  {JSX}
   */
  const emojiButton = emoji => (
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
  const emojiCategory = (name, buttons) => (
    <div key={name}>
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
      buttons.push(emojiButton(emoji))
    }

    // Add each category.
    categories.push(emojiCategory(category.name, buttons))
  }

  return (
    <div className={styles.emojipicker}>
      <div className={recentlyPicked.length ? '' : styles.hidden}>
        <h3>Recently picked</h3>
        <div className={styles.emojis}>
          {recentlyPicked.map(emojiButton).slice().reverse()}
        </div>
      </div>
      {categories}
    </div>
  )
}