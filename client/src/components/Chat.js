import React, { useState, useEffect } from 'react'
import useLocalState from '../hooks/useLocalState.js'
import shuffle from '../scripts/shuffle.js'
import deleteStateProperty from '../scripts/deleteStateProperty.js'
import connect from '../scripts/socket.js'
import ChatMeta from './Chat/Meta.js'
import ChatNavigation from './Chat/Navigation.js'
import ChatBox from './Chat/Box.js'
import Overlay from './Overlay.js'
import styles from './Chat.module.scss'

/**
 *  Functional component that displays the entire chat application.
 *  @returns  {JSX.Element}
 */
export default React.memo(function Chat() {

  // Create the state values that we want to back up locally.
  const [ currentRoomName, setCurrentRoomName ] = useLocalState('currentRoomName', '')
  const [ rooms, setRooms ] = useLocalState('rooms', {})

  // Create the state values that need to be reset on page load.
  const [ connection ] = useState(connect())
  const [ channels, setChannels ] = useState({})
  const [ senderId, setSenderId ] = useState(0)

  // Define the default room settings. We store messages in an array because 
  // JSON doesn't handle maps well and we use JSON to locally store our room
  // objects.
  const emptyRoom = { senderName: null, messages: [], users: {} }

  /**
   *  Function to get the current room from the rooms object if we can.
   *  @returns  {Object|undefined}
   */
  const currentRoom = () => rooms ? rooms[currentRoomName] : undefined

  /**
   *  Function to find the messages for the current room.
   *  @returns  {array}
   */
  const currentRoomMessages = () =>  currentRoom()?.messages || []

  /**
   *  Function to find the users for the current room excluding the current
   *  user.
   *  @returns  {array}
   */
  const currentRoomUsers = () =>  {

    // Get a local copy of all users in the current room.
    const users = { ...(currentRoom()?.users || {}) }

    // Get the name of the user in this channel.
    const userName = currentRoomSenderName()

    // Override the name of the sender.
    if (senderId && users[senderId] && userName) users[senderId].name = userName

    // Prepare an empty array to fill with user data.
    const list = []

    // Run through the user object to add the id to each user object, then add
    // them to the array.
    for(const [id, user] of Object.entries(users)) list.push({ ...user, id })

    // Expose the list of users as an array.
    return list
  }

  /**
   *  Function to find the sender name for the current room.
   *  @returns  {string}
   */
  const currentRoomSenderName = () => currentRoom()?.senderName || ''

  /**
   *  Function to set a new sender name for the current room.
   *  @param  {string} senderName   New sender name.
   */
  const setCurrentRoomSenderName = senderName => {

    // Cannot set the sender name for the current room if no room is selected.
    if (!currentRoom()) return

    // Update the sender name for the current room.
    setRooms(rooms => ({ ...rooms, [currentRoomName]: { ...rooms[currentRoomName], senderName } }))

    // Also update the user's name in the list.
    updateUser(currentRoomName, senderId, { name: senderName })
  }

  /**
   *  Function to unset the sender name for the current room.
   */
  const renameSender = () => void setCurrentRoomSenderName(null)

  /**
   *  Function to send a message.
   *  @param  {string}  text    Text of the new message to send.
   */
  const sendMessage = text => {

    // Get the current room.
    const room = currentRoom()

    // We do need a room, otherwise we cannot send anything.
    if (!room) return

    // Use the channel for the current room to send the message and the current
    // name of the sender to the server.
    channels[currentRoomName].push("new_message", {
      text,
      sender_name: room.senderName
    })
  }

  /**
   *  Function to process receiving a new message.
   *  @param  {string}  roomName  Name of the chat room in which a message is
   *                              received.
   *  @param  {Object}  message   Received message object.
   *    @property {Number}  id            Unique message identifier.
   *    @property {Date}    time          Message timestamp.
   *    @property {string}  text          Message text.
   *    @property {Number}  sender_id     Unique sender identifier.
   *    @property {string}  sender_name   Sender's name.
   */
  const receiveMessage = (roomName, { id, time, text, sender_id, sender_name }) => {

    // This function may be used inside of an event listener. In those cases,
    // a React state will still refer to the state's value when the event
    // listener was installed. However, we can abuse the setState method to get
    // a reliably up to date version of the state.
    let ownId = 0
    setSenderId(senderId => { ownId = senderId; return senderId })

    // The sender's name may have changed so we should update the user list. And
    // we can also use this message to update the timestamp for when the user
    // was last seen online.
    updateUser(roomName, sender_id, {
      name: sender_name,
      lastOnline: time,
    })

    // Now update the rooms.
    setRooms(rooms => {

      // Check if this room already exists. If not, use the default room.
      const currentRoom = rooms[roomName] ?? emptyRoom

      // Construct the message object.
      const newMessage = {
        id, time, text,

        // Remap the message to fit React naming conventions.
        senderId: sender_id,
        senderName: sender_name,

        // Also pass along the hue for this user in this room.
        senderHue: currentRoom.users[sender_id].hue,

        // The sender id might change on a page refresh or disconnect,
        // but we want to remember that the user sent this message, so
        // we want to store a persistent boolean value here rather than
        // a dynamically calculated value.
        self: sender_id === ownId,
      }

      // Skip adding this message if we already have it.
      if (currentRoom.messages.find(oldMessage => oldMessage.id === newMessage.id)) return rooms;

      // Add the new message to the current room. Make sure to also keep all
      // previous messages. Make sure to add the new message in front.
      const updatedRoom = { ...currentRoom, messages: [ newMessage, ...currentRoom.messages ] }

      // Add the new room to the existing rooms.
      return { ...rooms, [roomName]: updatedRoom }
    })
  }

  /**
   *  Function to pick a hue for the color of a new user in a specific room.
   *  This function tries to divide hues in such a way that as few users as
   *  possible share a similar color. Returns a number between 0 and 360.
   *  @param    {Object}    room  Room object for which to pick a hue.
   *  @returns  {integer}
   */
  const pickHue = room => {

    // List all supported hues. These hues are picked for legibility.
    const supportedHues = shuffle([30, 60, 90, 120, 150, 180, 300, 330])

    // Get a list of hues that are already taken.
    const taken = (room.users ?  Object.values(room.users) : [ ])

      // Hues wrap around a scale of 0 - 360, so we can use modulo here to
      // simplify the numbers.
      .map(user => user.hue % 360)

    // Pick the least used support hue.
    return supportedHues.sort((hueA, hueB) => {

      // Sort supported hues by how often they're used.
      return taken.filter(hue => hue === hueB).length - taken.filter(hue => hue === hueA).length

    // The last entry should be the least frequent hue.
    }).at(-1)
  }

  /**
   *  Function to add a new user to or update an existing user in an existing
   *  room.
   *  @param  {string}  roomName    Name of the chat room from which to update
   *                                the user.
   *  @param  {integer} userId      A number that uniquely identifies the user
   *                                to update.
   *  @param  {Object}  properties  An object with user properties to update.
   */
  const updateUser = (roomName, userId, properties) => {
    setRooms(rooms => {

      // Check if this room already exists. If not, use the default room.
      const room = rooms[roomName] ?? emptyRoom

      // Get the existing user or generate a new one.
      const existingUser = (room.users ? room.users[userId] : null) ?? {
        hue: pickHue(room),
        name: 'Anonymous',
      }

      // Add the properties to the user.
      const updatedUser = { ...existingUser, ...properties }

      // Add the new user to the designated room.
      const updatedRoom = { ...room, users: { ...room.users, [userId]: updatedUser } }

      // Add the new room to the existing rooms.
      return { ...rooms, [roomName]: updatedRoom }
    })
  }

  /**
   *  Method to update multiple users at the same time.
   *  @param  {string}  roomName    Name of the chat room from which to update
   *                                the users.
   *  @param  {Object}  users       Object that contains updates for a number
   *                                of users.
   *    @property   {Object}  {userId}    The key of each object is an id that
   *                                      uniquely identifies a user.
   *      @property   {[Object]}  metas   An array of objects that represent
   *                                      different instances of the same user
   *                                      (i.e. different browsers/devices).
   *        @property   {string}  online_at Timestamp indicating the last time
   *                                        the user was seen online.
   */
  const updateUsers = (roomName, users = {}) => {
    for (const [userId, user] of Object.entries(users)) {

      // If there are no metas to process for a user, we can skip that user.
      if (!user.metas || !user.metas.length) continue

      // Update every single user.
      updateUser(roomName, userId, {

        // Get the latest online_at tag from the metas.
        lastOnline: user.metas.reduce((accumulator, current) => {

          // Find the greatest date time tag.
          return current.online_at > accumulator ? current.online_at : accumulator

        // Start with an empty string.
        }, '')
      })
    }
  }

  /**
   *  Function to remove user from an existing room.
   *  @param  {string}  roomName  Name of the chat room from which to remove the
   *                              user.
   *  @param  {integer} userId    A number that uniquely identifies the user to
   *                              remove.
   */
  const removeUser = (roomName, userId) => {
    setRooms(rooms => {

      // Find the targeted room.
      const room = rooms[roomName]

      // No reason to remove a user if the room does not exist or does not have
      // this user.
      if (!room || !room.users || !room.users[userId]) return rooms

      // Make a local copy of the users object.
      const users = { ...room.users }

      // Remove the targeted user.
      delete users[userId]

      // Update the targeted room.
      const updatedRoom = { ...room, users }

      // Update the room in the existing rooms.
      return { ...rooms, [roomName]: updatedRoom }
    })
  }

  /**
   *  Method to remove multiple users at the same time.
   *  @param  {string}  roomName    Name of the chat room from which to remove
   *                                the users.
   *  @param  {Object}  users       Object that contains details for a number
   *                                of users.
   *    @property   {Object}  {userId}      The key of each object is an id that
   *                                        uniquely identifies a user.
   */
  const removeUsers = (roomName, users = {}) => {
    for (const userId in users) removeUser(roomName, userId)
  }

  /**
   *  Function to reset the users for an existing room.
   *  @param  {string}  roomName  Name of the chat room for which to reset the
   *                              users object.
   */
  const resetUsers = roomName => {
    setRooms(rooms => {

      // Create a local copy of the rooms.
      const updatedRooms = { ...rooms }

      // Remove all users from the target room.
      updatedRooms[roomName].users = {}

      // Set the updated rooms object.
      return updatedRooms
    })
  }

  /**
   *  Function to join a channel.
   *  @param  {string}  name  The name of the channel to join. This is usually
   *                          a channel by the same name of the room.
   */
  const joinChannel = name => {

    // No need to join the channel if we've already joined it.
    if (channels[name]) return

    // Construct a channel for this room. This object is used to send and
    // receive messages in a specific room.
    const channel = connection.channel(`room:${name}`, {})

    // Forward chat messages to the receive message method.
    channel.on('message', message => void receiveMessage(name, message))

    // Reset the users every time we get a full update for this channel.
    channel.on('presence_state', state => {

      // First reset the current users for this room.
      resetUsers(name)

      // Now add back all users mentioned in the state update.
      updateUsers(name, state)
    })

    // In between, we use incremental updates on who left/joined a channel to
    // update our user administration for the channel.
    channel.on('presence_diff', diff => {

      // Add users that joined.
      if (diff.joins) updateUsers(name, diff.joins)

      // Remove users that left.
      if (diff.leaves) removeUsers(name, diff.leaves)
    })

    // Join the room and start listening for messages. Update our sender id with
    // the response for joining each channel.
    channel.join().receive('ok', response => setSenderId(response.sender_id))

    // Add the channel to our collection.
    setChannels(channels => ({ ...channels, [name]: channel }))
  }

  /**
   *  Function to join a room.
   *  @param  {string}  name  The name of the room to join.
   */
  const joinRoom = name => {

    // We should have a valid name to join a room.
    if (!name) return

    // Join the channel for this room if we haven't already.
    if (!channels[name]) joinChannel(name)

    // Add an empty room with this name if we haven't already.
    if (!rooms[name]) setRooms(rooms => ({ ...rooms, [name]: emptyRoom }))
  }

  /**
   *  Function to select a room.
   *  @param  {string}  name  The name of the room to join.
   */
  const selectRoom = name => {

    // Make sure that we join this room.
    joinRoom(name)

    // Update the state.
    setCurrentRoomName(name)

    // Update the URL.
    window.history.pushState({}, '', encodeURI(`/room/${name}`))
  }

  /**
   *  Function to select a room from the current URL.
   */
  const selectRoomFromLocation = () => {

    // This function only joins rooms.
    if (!window.location.pathname?.startsWith('/room/')) return

    // Get the name of the room from the pathname.
    const room = decodeURI(window.location.pathname?.split('/')[2])

    // No need to join anything if we're already in the correct room.
    if (room === currentRoomName) return

    // Make sure that we join this room.
    joinRoom(room)

    // Update the current room state.
    setCurrentRoomName(room)
  }

  /**
   *  Function to deselect the current room. This will navigate away from the
   *  room, but keep its state for future reference.
   */
  const deselectRoom = () => {

    // Unset the current room name.
    setCurrentRoomName('')

    // Update the URL.
    window.history.pushState({}, '', '/')
  }

  /**
   *  Function to leave the current room. This will navigate away from the room
   *  and forget its state.
   */
  const leaveRoom = () => {

    // Make sure we remember the current room's name.
    const roomName = currentRoomName

    // Then deselect the current room.
    deselectRoom()

    // Leave the channel for this room if it has one.
    channels[roomName]?.leave()

    // Remove both the room and the channel.
    deleteStateProperty(roomName, setRooms)
    deleteStateProperty(roomName, setChannels)
  }

  // We want to do the following things only once, and not on ever rerender. We
  // can do that by using a useEffect that never repeats.
  useEffect(() => {

    // On page load, make sure that we have a channel for each room.
    for (const roomName in rooms) joinChannel(roomName)

    // Start listening for navigation changes.
    window.addEventListener('popstate', selectRoomFromLocation)

    // Check if we should join a room based on the current location.
    selectRoomFromLocation()

    // We can ignore warnings about the missing dependencies as this is supposed
    // to run only on first render, regardless of any changes to dependencies.
    // @todo: It would be nice to find a cleaner solution for this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.chat}>
      <ChatMeta
        roomName={currentRoomName}
        messages={currentRoomMessages()}
      />
      <main className={currentRoomName ? styles.showRoom : ''}>
        <ChatNavigation
          rooms={rooms}
          currentRoom={currentRoomName}
          selectRoom={selectRoom}
        />
        <ChatBox
          roomName={currentRoomName}
          messages={currentRoomMessages()}
          users={currentRoomUsers()}
          senderName={currentRoomSenderName()}
          sendMessage={sendMessage}
          updateName={setCurrentRoomSenderName}
          deselectRoom={deselectRoom}
          leaveRoom={leaveRoom}
          renameSender={renameSender}
        />
        <Overlay
          visible={!rooms || !Object.keys(rooms).length}
          title="What is the first room you want to join?"
          placeholder="E.g. Lobby 1..."
          button="Join"
          onSubmit={selectRoom}
        />
      </main>
    </div>
  )
})
