import React from 'react'
import { Helmet } from 'react-helmet-async'

/**
 *  Functional component that controls the chat's metadata.
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function ChatMeta(props) {

  // Extract the props that we want to use.
  const { roomName, messages } = props

  /**
   *  Function to construct the current URL.
   *  @returns  {string}
   */
  const currentURL = () => {

    // Construct a clean URL for the room if we're in one. This will strip off
    // any unwanted query parameters.
    if (roomName) return `${document.location.origin}/room/${encodeURI(roomName)}`

    // Otherwise we just use the current location as it is. 
    return document.location.href
  }

  /**
   *  Function to construct a static title for the current page.
   *  @returns  {string}
   */
  const staticTitle = () => {

    // If we have no message to display, but we do have a room name to show,
    // show that isntead.
    if (roomName) return `Room: ${roomName}`
    
    // Return the most basic app description.
    return 'Chat'
  }

  /**
   *  Function to construct an active title with message updates.
   *  @returns  {string}
   */
  const activeTitle = () => {

    // If we have messages, we should display the most recent one.
    if (messages.length) {

      // Get the last message.
      const last = messages.at(0)

      // Display the message in the title.
      return `${last.senderName}: ${last.text}`
    }

    // Default to a static title instead.
    return staticTitle()
  }

  // Construct a basic description for the application.
  const description = "A very simple website that lets you chat anonymously in different chatrooms."
  
  return (
    <Helmet>
      <title>{activeTitle()}</title>
      <link rel="canonical"  href={currentURL()} />
      <meta name="description" content={description} />
      <meta property="og:title" content={staticTitle()} />
      <meta property="og:url" content={currentURL()} />
      <meta property="og:description" content={description} />
    </Helmet>
  )
}
