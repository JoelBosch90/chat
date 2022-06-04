import * as actions from './actionTypes'

export const messageReceived = ({ roomName, message }) => ({
  type: actions.MESSAGE_RECEIVED,
  payload: {
    roomName,
    message,
  },
})