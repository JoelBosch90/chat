/**
 *  We use a central data store to simplify data access across our application.
 *  This means that we can decentralize data management, manage relevant
 *  data in the components that are most closely related to the data, and
 *  communicate that data diagonally across the application without travelling
 *  through shared parent components. This helps boost app performance because
 *  fewer rerenders are triggered when data updates travel through fewer
 *  components.
 */

// Import Redux dependencies.
import { configureStore } from '@reduxjs/toolkit'

// Import reducers.
import currentRoomName from './features/currentRoomName'
import senderId from './features/senderId'
import rooms from './features/rooms'

export default configureStore({ 
  reducer: {
    currentRoomName,
    senderId,
    rooms,
  }
})