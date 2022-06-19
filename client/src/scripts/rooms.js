/**
 *  Function to find the users for a specific room excluding the current user.
 *  @param    {Object}    room        The room object from which to get the
 *                                    users.
 *  @param    {Number}    senderId    Optionally, the sender id can be used to
 *                                    make sure that we always add the name for
 *                                    the current user.
 *  @returns  {array}
 */
export const users = (room = {}, senderId = 0) =>  {

  // Get a local copy of all users in the current room.
  const users = { ...(room.users || {}) }

  // Override the name of the sender if we have it.
  const withOwnName = senderId && users[senderId] && room.senderName ? { ...users, [senderId]: { ...users[senderId], name: room.senderName }} : users

  // Return an array of user objects with the id added.
  return Object.entries(withOwnName).map(([id, user]) => ({ ...user, id }))
}

/**
 *  Function that adds a new message only if it is not already present
 *  in the provided array of messages.
 *  @param    {array}   messages      List of message.
 *  @param    {Object}  newMessage    New message that is added only if it is
 *                                    not already present.
 *  @returns  {array}
 */
export const uniqueMessages = (messages, newMessage) => {

  // Check if a message with this ID already exists in this array. If so, we
  // don't add the new one.
  if (messages.find(oldMessage => oldMessage.id === newMessage.id)) return messages

  // Otherwise, we add the new one.
  return [ ...messages, newMessage ]
}