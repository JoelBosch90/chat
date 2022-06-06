/**
 *  This file exports the slice for the current room name property. This
 *  property is used to identify the room that's currently selected.
 */
import { createSlice } from '@reduxjs/toolkit'

// Allow importing of the slice object.
export const currentRoomNameSlice = createSlice ({
  name: 'currentRoomName',
  initialState: '',
  reducers: {

    /**
     *  Reducer used to update the current room name.
     *  @param  {Proxy}  state    An Immer object describing the current state.
     *                            This means that we can safely update object
     *                            properties without worrying about
     *                            immutability.
     *    @property {String}  currentRoomName  The state should at least have a
     *                                         property that describes the 
     *                                         current room name.
     *  @param  {Object}  action  The action object describing the update.
     *    @property {String}  payload          The payload should be a string
     *                                         that identifies the name of the
     *                                         newly selected room.
     */
    roomSelected: (state, action) => action.payload
  }
})

// Allow importing of the actions separately.
export const { roomSelected } = currentRoomNameSlice.actions

// By default, w want to simply import the reducer.
export default currentRoomNameSlice.reducer