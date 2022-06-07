/**
 *  Function to construct a static title for the current page.
 *  @param    {string}      roomName    The name of the currently selected 
 *                                      room.
 *  @returns  {string}
 */
export const staticTitle = (roomName) => {

  // If we have no message to display, but we do have a room name to show,
  // show that isntead.
  if (roomName) return `Room: ${roomName}`
  
  // Return the most basic app description.
  return 'Chat'
}

/**
 *  Function to construct an active title with message updates.
 *  @param    {string}      roomName    The name of the currently selected 
 *                                      room.
 *  @param    {Object}      rooms       The rooms object containing the
 *                                      messages for the currently selected
 *                                      room.
 *  @returns  {string}
 */
export const activeTitle = (roomName, rooms) => {

  // Get access to the messages in the current room.
  const messages = rooms[roomName]?.messages

  // If we have messages, we should display the most recent one.
  if (messages && messages.length) {

    // Get the last message.
    const last = messages.at(0)

    // Display the message in the title.
    return `${last.senderName}: ${last.text}`
  }

  // Default to a static title instead.
  return staticTitle(roomName)
}