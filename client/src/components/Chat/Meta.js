// Import React dependencies.
import { useCallback } from 'react'
import { Helmet } from 'react-helmet-async'

// Import store dependencies.
import { useSelector } from 'react-redux'

// Import script dependencies.
import { dynamicTitle } from '../../scripts/title'
import currentURL from '../../scripts/currentURL'

/**
 *  Functional component that controls the chat's metadata.
 *  @returns  {JSX.Element}
 */
export default function ChatMeta() {

  // To construct the URL and the title, we need access to the name of the
  // currently selected room.
  const currentRoomName = useSelector(state => state.currentRoomName)

  // To create an dynamic title, we 
  const currentRoom = useSelector(state => state.rooms[currentRoomName])

  // Construct a basic description for the application.
  const description = "A very simple website that lets you chat anonymously in different chatrooms."

  // Get access to up to the up to date URL and title.
  const url = useCallback(() => currentURL(currentRoomName, document), [currentRoomName])
  const title = useCallback(() => dynamicTitle(currentRoomName, currentRoom), [currentRoomName, currentRoom])
  
  return (
    <Helmet>
      <title>{title()}</title>
      <link rel="canonical"  href={url()} />
      <meta name="description" content={description} />
      <meta property="og:title" content={title()} />
      <meta property="og:url" content={url()} />
      <meta property="og:description" content={description} />
    </Helmet>
  )
}
