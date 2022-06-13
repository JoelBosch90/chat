// Import React dependencies.
import React, { useState, createContext, useMemo } from 'react'

// Import used scripts.
import connect from '../scripts/requests/socket'

/**
 *  There are some properties that we want to share with other components. The
 *  ones that are JSON serializable and need to persist over multiple sessions
 *  are shared through Redux.
 *  However, to send and receive messages, we also need to manage our WebSocket
 *  connection. This is done through objects that cannot be JSON serialized, and
 *  do not need to persist over multiple sessions. We still need to share these 
 *  objects with multiple components, so we create a context through which we'll
 *  make these available.
 */
export const ConnectionContext = createContext({
  connection: false,
  setConnection: () => undefined,
  channels: {},
  setChannels: () => undefined,
})

/**
 *  Functional component that displays the entire chat application.
 *  @param    {Object}      props     Props object.
 *    @property {Array}       children  Child components that will be installed.
 *  @returns  {JSX.Element}
 */
const ConnectionContextProvider = ({ children }) => {

  // Create the connection getters and setters that we want to provide in this
  // context.
  const [ channels, setChannels ] = useState({})
  const [ connection, setConnection ] = useState(connect())
    
  // Create the object to share with the connection context.
  const connectionContext = useMemo(() => ({
    connection, setConnection, channels, setChannels
  }), [connection, channels])

  return (
    <ConnectionContext.Provider value={connectionContext}>
      { children }
    </ConnectionContext.Provider>
  )
}

export default ConnectionContextProvider
