import React from 'react'
import ReactDOM from 'react-dom'
import { HelmetProvider  } from 'react-helmet-async'
import Chat from './components/Chat.js'

// Import global styling.
import './styles/global.scss'

ReactDOM.render(
  <HelmetProvider>
    <React.StrictMode>
      <Chat />
    </React.StrictMode>
  </HelmetProvider>,
  document.getElementById('root')
)
