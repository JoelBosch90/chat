import React from 'react'
import ChatGroupList from './ChatGroupList.js'
import ChatBox from './ChatBox.js'
import './App.scss'

export default class App extends React.Component {
  render () {
    return (
      <div className="app">
        <main> 
          <ChatGroupList />
          <ChatBox />
        </main>
      </div>
    )
  }
}
