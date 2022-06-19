/**
 *  This file exports the slice for the current rooms object. This
 *  property is used to list the names and states of each of the currently
 *  joined rooms. This includes all of the messages in each room.
 */

// Import Redux dependencies.
import { createSlice } from '@reduxjs/toolkit'

// Allow importing of the slice object.
export const roomsSlice = createSlice ({
  name: 'rooms',
  initialState: {},
  reducers: {

    /**
     *  Reducer used to join a new room. If called with the name of an existing
     *  room, this reducer won't change anything.
     *  @param  {Proxy}  state    An Immer object describing the current state.
     *                            This means that we can safely update object
     *                            properties without worrying about
     *                            immutability.
     *    @property {String}  rooms     The state should at least have a
     *                                  property that describes the rooms
     *                                  object.
     *  @param  {Object}  action  The action object describing the update.
     *    @property {String}  payload   The payload should describe the name of
     *                                  the room that's been joined.
     */
    roomJoined: (state, action) => {

      // No need to create a room object if we already have one.
      if (action.payload in state) return

      // Otherwise, we start with a fresh new room object.
      state[action.payload] = { senderName: null, messages: [], users: {} }
    },

    /**
     *  Reducer used to leave an existing room.
     *  @param  {Proxy}  state    An Immer object describing the current state.
     *                            This means that we can safely update object
     *                            properties without worrying about
     *                            immutability.
     *    @property {String}  rooms     The state should at least have a
     *                                  property that describes the rooms
     *                                  object.
     *  @param  {Object}  action  The action object describing the update.
     *    @property {String}  payload   The payload should describe the name of
     *                                  the room that's been left.
     */
    roomLeft: (state, action) => {

      // Remove the room object if we have it.
      if (action.payload in state) delete state[action.payload]
    },

    /**
     *  Reducer used to set the user's sender name on a specific room.
     *  @param  {Proxy}  state    An Immer object describing the current state.
     *                            This means that we can safely update object
     *                            properties without worrying about
     *                            immutability.
     *    @property {String}  rooms     The state should at least have a
     *                                  property that describes the rooms
     *                                  object.
     *  @param  {Object}  action  The action object describing the update.
     *    @property {Object}  payload   The payload should be an object with
     *                                  several properties.
     *      @property {String}  roomName    The name of the room on which to
     *                                      set the new sender name.
     *      @property {String}  senderName  The new sender name to set.
     */
    senderNameUpdated: (state, action) => {

      // Extract the relevant properties.
      const { roomName, senderName } = action.payload

      // We cannot set the sender name on a room we don't have.
      if (!(roomName in state)) return

      // Set the new sender name on this room.
      state[roomName].senderName = senderName
    },

    /**
     *  Reducer used to set a received message on the appropriate room.
     *  @param  {Proxy}  state    An Immer object describing the current state.
     *                            This means that we can safely update object
     *                            properties without worrying about
     *                            immutability.
     *    @property {String}  rooms     The state should at least have a
     *                                  property that describes the rooms
     *                                  object.
     *  @param  {Object}  action  The action object describing the update.
     *    @property {Object}  payload   The payload should be an object with
     *                                  several properties.
     *      @property {String}  roomName      The name of the room for which to
     *                                        receive the message.
     *      @property {Number}  id            Unique message identifier.
     *      @property {Date}    time          Message timestamp.
     *      @property {String}  text          Message text.
     *      @property {Number}  senderId      Unique sender identifier.
     *      @property {String}  senderName    Sender's name.
     *      @property {Number}  senderHue     Sender's hue.
     *      @property {Boolean} self          Was this message sent by the
     *                                        current user?
     */
    messageReceived: (state, action) => {

      // Extract the relevant properties.
      const { roomName, id, time, text, senderId, senderName, senderHue, self } = action.payload

      // We cannot receive a message on a room we don't have.
      if (!(roomName in state)) return

      // Make sure we don't add a duplicate message.
      if (state[roomName].messages.find(message => message.id === id)) return

      // Add the message to the front of the array.
      state[roomName].messages.unshift({
        id, time, text, senderId, senderName, senderHue, self
      })
    },

    /**
     *  Reducer used to add a user to a room, or update an existing user.
     *  @param  {Proxy}  state    An Immer object describing the current state.
     *                            This means that we can safely update object
     *                            properties without worrying about
     *                            immutability.
     *    @property {String}  rooms     The state should at least have a
     *                                  property that describes the rooms
     *                                  object.
     *  @param  {Object}  action  The action object describing the update.
     *    @property {Object}  payload   The payload should be an object with
     *                                  several properties.
     *      @property {String}  roomName    The name of the room in which to add
     *                                      or update the user.
     *      @property {Number}  id          Unique user identifier.
     *      @property {Number}  hue         (Optional) The hue for the color to
     *                                      help identify this user's messages.
     *      @property {String}  name        (Optional) The user's name.
     *      @property {String}  lastOnline  (Optional) A timestamp describing
     *                                      when this user was last seen online.
     */
    userUpdated: (state, action) => {

      // Extract the relevant properties.
      const { roomName, id } = action.payload

      // We cannot add a user to a room we don't have.
      if (!(roomName in state)) return

      // Make sure we have a user object for this user id.
      if (!(id in state[roomName].users)) state[roomName].users[id] = {}

      // Only update properties if they were provided in the action payload.
      if ('hue' in action.payload) state[roomName].users[id].hue = action.payload.hue
      if ('name' in action.payload) state[roomName].users[id].name = action.payload.name
      if ('lastOnline' in action.payload) state[roomName].users[id].lastOnline = action.payload.lastOnline
    },

    /**
     *  Reducer used to remove an existing user from a specific room.
     *  @param  {Proxy}  state    An Immer object describing the current state.
     *                            This means that we can safely update object
     *                            properties without worrying about
     *                            immutability.
     *    @property {String}  rooms     The state should at least have a
     *                                  property that describes the rooms
     *                                  object.
     *  @param  {Object}  action  The action object describing the update.
     *    @property {Object}  payload   The payload should be an object with
     *                                  several properties.
     *      @property {String}  roomName  The name of the room from which to
     *                                    remove the user.
     *      @property {Number}  id        Unique user identifier.
     */
    userRemoved: (state, action) => {

      // Extract the relevant properties.
      const { roomName, id } = action.payload

      // We cannot remove a user from a room we don't have.
      if (!(roomName in state)) return

      // Remove the user from the room if possible.
      if (id in state[roomName].users) delete state[roomName].users[id]
    },

    /**
     *  Reducer used to reset all user's names in a specific room.
     *  @param  {Proxy}  state    An Immer object describing the current state.
     *                            This means that we can safely update object
     *                            properties without worrying about
     *                            immutability.
     *    @property {String}  rooms     The state should at least have a
     *                                  property that describes the rooms
     *                                  object.
     *  @param  {Object}  action  The action object describing the update.
     *    @property {Object}  payload   The payload should be an object with
     *                                  several properties.
     *      @property {String}  roomName  The name of the room in which to reset
     *                                    all users.
     */
    usersReset: (state, action) => {

      // Extract the relevant properties.
      const { roomName } = action.payload

      // We cannot remove a user from a room we don't have.
      if (!(roomName in state)) return

      // Reset the users object.
      state[roomName].users = {}
    },
  }
})

// Allow importing of the actions separately.
export const {
  roomJoined, roomLeft, senderNameUpdated, messageReceived,
  userUpdated, userRemoved, usersReset
} = roomsSlice.actions

// By default, w want to simply import the reducer.
export default roomsSlice.reducer