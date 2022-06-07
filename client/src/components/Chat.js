// Import React dependencies.
import React, { useEffect, useCallback, useContext } from 'react'

// Import store dependencies.
import { useSelector, useDispatch } from 'react-redux'
import { roomSelected } from '../store/features/currentRoomName'
import { senderIdUpdated } from '../store/features/senderId'
import {
  roomJoined, roomLeft, senderNameUpdated, messageReceived,
  userUpdated, userRemoved, usersReset, 
} from '../store/features/rooms'

// Import used scripts.
import deleteStateProperty from '../scripts/generic/deleteStateProperty'
import pickHue from '../scripts/pickHue'

// Import used components.
import { ConnectionContext } from './ConnectionContextProvider'
import ChatMeta from './Chat/Meta'
import ChatNavigation from './Chat/Navigation'
import ChatBox from './Chat/Box'
import Overlay from './Overlay'

// Import styles.
import styles from './Chat.module.scss'

/**
 *  Functional component that displays the entire chat application.
 *  @returns  {JSX.Element}
 */
export default function Chat() {
  
  // Create the dispatch function to interact with the stores.
  const dispatch = useDispatch()

  // Create the getter and setter for the current room name.
  const currentRoomName = useSelector(state => state.currentRoomName)
  const setCurrentRoomName = name => dispatch(roomSelected(name))
  
  // Create the getter and setter for the current room name.
  const senderId = useSelector(state => state.senderId)
  const setSenderId = id => dispatch(senderIdUpdated(id))

  // Get access to the rooms object.
  const rooms = useSelector(state => state.rooms)

  // Get access to the connection context.
  const { connection, channels, setChannels } = useContext(ConnectionContext)

  /**
   *  Function to add a new user to or update an existing user in an existing
   *  room.
   *  @param  {string}  roomName    Name of the chat room from which to update
   *                                the user.
   *  @param  {integer} id          A number that uniquely identifies the user
   *                                to update.
   *  @param  {Object}  properties  An object with user properties to update.
   */
  const updateUser = useCallback((roomName, id, properties) => {

    // Check if this room already exists. If not, use the default room.
    const room = rooms[roomName]

    // Get the existing user or generate a new one.
    const existingUser = (room.users ? room.users[id] : null) ?? {
      hue: pickHue(room),
      name: 'Anonymous',
    }

    // Update or add the user for this specific room.
    dispatch(userUpdated({
      roomName,
      id, 
      ...{
        hue: existingUser.hue,
        name: existingUser.name,
      },
      ...properties,
    }))
  }, [dispatch, rooms])

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
  const updateUsers = useCallback((roomName, users = {}) => {
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
  }, [updateUser])

  /**
   *  Function to remove user from an existing room.
   *  @param  {string}  roomName  Name of the chat room from which to remove the
   *                              user.
   *  @param  {integer} id        A number that uniquely identifies the user to
   *                              remove.
   */
  const removeUser = useCallback((roomName, id) => void dispatch(userRemoved({ roomName, id })), [dispatch])

  /**
   *  Method to remove multiple users at the same time.
   *  @param  {string}  roomName    Name of the chat room from which to remove
   *                                the users.
   *  @param  {Object}  users       Object that contains details for a number
   *                                of users.
   *    @property   {Object}  {userId}      The key of each object is an id that
   *                                        uniquely identifies a user.
   */
  const removeUsers = useCallback((roomName, users = {}) => {
    for (const userId in users) removeUser(roomName, userId)
  }, [removeUser])

  /**
   *  Function to reset the users for an existing room.
   *  @param  {string}  roomName  Name of the chat room for which to reset the
   *                              users object.
   */
  const resetUsers = useCallback(roomName => void dispatch(usersReset({ roomName })), [dispatch])

  /**
   *  Function to get the current room from the rooms object if we can.
   *  @returns  {Object|undefined}
   */
  const currentRoom = useCallback(() => rooms ? rooms[currentRoomName] : undefined, [rooms, currentRoomName])

  /**
   *  Function to find the messages for the current room.
   *  @returns  {array}
   */
  const currentRoomMessages = useCallback(() =>  currentRoom()?.messages || [], [currentRoom])

  /**
   *  Function to find the sender name for the current room.
   *  @returns  {string}
   */
  const currentRoomSenderName = useCallback(() => currentRoom()?.senderName || '', [currentRoom])

  /**
   *  Function to set a new sender name for the current room.
   *  @param  {string} senderName   New sender name.
   */
  const setCurrentRoomSenderName = useCallback(senderName => {

    // Cannot set the sender name for the current room if no room is selected.
    if (!currentRoom()) return

    // Update the sender name for the current room.
    dispatch(senderNameUpdated({ roomName: currentRoomName, senderName }))

    // Also update the user's name in the list.
    updateUser(currentRoomName, senderId, { name: senderName })
  }, [currentRoomName, dispatch, updateUser, senderId])

  /**
   *  Function to find the users for the current room excluding the current
   *  user.
   *  @returns  {array}
   */
  const currentRoomUsers = useCallback(() =>  {

    // Get a local copy of all users in the current room.
    const users = { ...(currentRoom()?.users || {}) }

    // Get the name of the user in this channel.
    const userName = currentRoomSenderName()

    // Override the name of the sender if we have it.
    const withOwnName = senderId && users[senderId] && userName ? { ...users, [senderId]: { ...users[senderId], name: userName }} : users

    // Return an array of user objects with the id added.
    return Object.entries(withOwnName).map(([id, user]) => ({ ...user, id }));
  }, [currentRoom, currentRoomSenderName, senderId])

  /**
   *  Function to unset the sender name for the current room.
   */
  const resetSenderName = useCallback(() => void setCurrentRoomSenderName(null), [setCurrentRoomName])

  /**
   *  Callback to process receiving a new message.
   *  @param  {string}  roomName  Name of the chat room in which a message is
   *                              received.
   *  @param  {Object}  message   Received message object.
   *    @property {Number}  id            Unique message identifier.
   *    @property {Date}    time          Message timestamp.
   *    @property {string}  text          Message text.
   *    @property {Number}  sender_id     Unique sender identifier.
   *    @property {string}  sender_name   Sender's name.
   */
  const receiveMessage = useCallback((roomName, { id, time, text, sender_id, sender_name }) => {

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

    // Now add the message to the room.
    dispatch(messageReceived({
      roomName,
      id, time, text,
      senderId: sender_id,
      senderName: sender_name,
      self: sender_id === ownId,
    }))
  }, [dispatch,  setSenderId, updateUser])

  /**
   *  Function to join a channel.
   *  @param  {string}  name  The name of the channel to join. This is usually
   *                          a channel by the same name of the room.
   */
  const joinChannel = useCallback(name => {

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
  }, [channels, connection, receiveMessage, resetUsers, updateUsers, removeUsers, setSenderId, setChannels])

  /**
   *  Function to join a room.
   *  @param  {string}  name  The name of the room to join.
   */
  const joinRoom = useCallback(name => {

    // We should have a valid name to join a room.
    if (!name) return

    // Join the channel for this room if we haven't already.
    if (!channels[name]) joinChannel(name)

    // Add an empty room with this name if we haven't already.
    if (!rooms[name]) dispatch(roomJoined(name))
  }, [channels, joinChannel, dispatch])

  /**
   *  Function to select a room.
   *  @param  {string}  name  The name of the room to join.
   */
  const selectRoom = useCallback(name => {

    // Make sure that we join this room.
    joinRoom(name)

    // Update the state.
    setCurrentRoomName(name)

    // Update the URL.
    window.history.pushState({}, '', encodeURI(`/room/${name}`))
  }, [joinRoom, setCurrentRoomName])

  /**
   *  Function to select a room from the current URL.
   */
  const selectRoomFromLocation = useCallback(() => {

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
  }, [joinRoom, setCurrentRoomName])

  /**
   *  Function to deselect the current room. This will navigate away from the
   *  room, but keep its state for future reference.
   */
  const deselectRoom = useCallback(() => {

    // Unset the current room name.
    setCurrentRoomName('')

    // Update the URL.
    window.history.pushState({}, '', '/')
  }, [setCurrentRoomName])

  /**
   *  Function to leave the current room. This will navigate away from the room
   *  and forget its state.
   */
  const leaveRoom = useCallback(() => {

    // Make sure we remember the current room's name.
    const roomName = currentRoomName

    // Then deselect the current room.
    deselectRoom()

    // Leave the channel for this room if it has one.
    channels[roomName]?.leave()

    // Remove both the room and the channel.
    dispatch(roomLeft(roomName))
    deleteStateProperty(roomName, setChannels)
  }, [currentRoomName, deselectRoom, channels, dispatch, setChannels])

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
      <ChatMeta />
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
          updateName={setCurrentRoomSenderName}
          deselectRoom={deselectRoom}
          leaveRoom={leaveRoom}
          renameSender={resetSenderName}
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
}
