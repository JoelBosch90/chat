import React from 'react'
import ReactDOM from 'react-dom'
import Chat from './components/Chat.js'

// Import global styling.
import './styles/global.scss'

ReactDOM.render(
  <React.StrictMode>
    <Chat />
  </React.StrictMode>,
  document.getElementById('root')
);
