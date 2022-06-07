// Import React dependencies.
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider  } from 'react-helmet-async'

// Import store dependencies.
import { Provider } from 'react-redux'
import store from './store/store'

// Import components.
import { ConnectionContextProvider } from './components/ConnectionContextProvider'
import Chat from './components/Chat'

// Import global styling.
import './styles/global.scss'

// Create the React root element and use that to render the application.
const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ConnectionContextProvider>
          <Chat />
        </ConnectionContextProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)
