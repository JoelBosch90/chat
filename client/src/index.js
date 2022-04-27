import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider  } from 'react-helmet-async'
import Chat from './components/Chat.js'

// Import global styling.
import './styles/global.scss'

// Create the React root element and use that to render the application.
const root = createRoot(document.getElementById('root'))
root.render(
  <HelmetProvider>
    {/* <React.StrictMode> */}
      <Chat />
    {/* </React.StrictMode> */}
  </HelmetProvider>
)
