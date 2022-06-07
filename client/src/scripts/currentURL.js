/**
 *  Function to construct the current URL.
 *  @param    {string}      roomName    The name of the currently selected 
 *                                      room.
 *  @param    {Document}    document    The document for which to find the
 *                                      current URL.
 *  @returns  {string}
 */
export default (roomName, document) => {

  // The document should at least have a location.
  if (!document.location) return undefined

  // Construct a clean URL for the room if we're in one. This will strip off
  // any unwanted query parameters.
  if (roomName) return `${document.location.origin}/room/${encodeURI(roomName)}`

  // Otherwise we just use the current location as it is. 
  return document.location.href
}