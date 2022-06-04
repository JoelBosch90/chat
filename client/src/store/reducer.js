import * as actions from './actionTypes'

export default reducer = (state, action) => {
  switch (action.type) {
    case actions.MESSAGE_RECEIVED:
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.roomName]: {
            ...state.rooms[action.payload.roomName],
            messages: [
              ...state.rooms[action.payload.roomName].messages,
              action.payload.message,
            ]
          }
        }
      }
  }
}