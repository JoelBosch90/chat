/**
 *  This file exports the slice for the sender id property. This
 *  property is used to keep track of the id that was last assigned to the
 *  current user. We can use this id to identify when we receive messages that
 *  we send ourselves.
 */
import { createSlice } from '@reduxjs/toolkit'

// Allow importing of the slice object.
export const senderIdSlice = createSlice ({
  name: 'senderId',
  initialState: 0,
  reducers: {

    /**
    *  Reducer used to update the current room name.
    *  @param  {Proxy}  state    An Immer object describing the current state.
    *                            This means that we can safely update object
    *                            properties without worrying about
    *                            immutability.
    *    @property {Number}  senderId         The state should at least have a
    *                                         property that describes the 
    *                                         current sender id.
    *  @param  {Object}  action  The action object describing the update.
    *    @property {Number}  payload          The payload should be a string
    *                                         with the newly updated sender id.
    */
    senderIdUpdated: (state, action) => action.payload
  }
})

// Allow importing of the actions separately.
export const { senderIdUpdated } = senderIdSlice.actions

// By default, w want to simply import the reducer.
export default senderIdSlice.reducer