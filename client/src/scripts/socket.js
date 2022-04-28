// Import dependencies.
import { Socket } from 'phoenix'

/**
 *  Function to connect to the message server to start receiving messages.
 *  @return {Object}
 */
const connect = () => {

  // If the website is running over HTTPS, we should also secure our
  // websocket connections.
  const protocol = window.location.protocol.startsWith('https') ? 'wss' : 'ws'

  // Construct the socket connection object.
  const socket = new Socket(`${protocol}://${window.location.host}/api/socket`)

  // Connect to the server.
  socket.connect()

  // Expose the socket.
  return socket
}

// Export the connect function by default.
export default connect