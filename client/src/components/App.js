import React from 'react'
import ChatGroupList from './ChatGroupList.js'
import ChatBox from './ChatBox.js'
import './App.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSender: {
        id: 0,
        name: 'Sender 1'
      },
      currentGroup: 2,
      groups: [
        {
          id: 0,
          name: 'Group 1',
          messages: [
            {
              id: 0,
              time: Date.now() - 30000,
              text: 'Example text message 1.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 1,
              time: Date.now() - 23000,
              text: 'Example text message 2.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 2,
              time: Date.now() - 13000,
              text: 'Example text message 3.',
              sender: {
                id: 1,
                name: 'Sender 2'
              }
            },
            {
              id: 3,
              time: Date.now() - 5000,
              text: 'Example text message 4.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 4,
              time: Date.now() - 3000,
              text: 'Example text message 5.',
              sender: {
                id: 1,
                name: 'Sender 2'
              }
            },
            {
              id: 5,
              time: Date.now(),
              text: 'Example text message 6.',
              sender: {
                id: 1,
                name: 'Sender 2'
              }
            },
          ]
        },
        {
          id: 1,
          name: 'Group 1',
          messages: [
            {
              id: 0,
              time: Date.now() - 65000,
              text: 'Example text message 1.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 1,
              time: Date.now() - 60000,
              text: 'Example text message 2.',
              sender: {
                id: 2,
                name: 'Sender 3'
              }
            },
          ]
        },
        {
          id: 2,
          name: 'Group 3',
          messages: [
            {
              id: 0,
              time: Date.now() - 313000,
              text: 'Example text message 1.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 1,
              time: Date.now() - 312000,
              text: 'Example text message 2.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 2,
              time: Date.now() - 306000,
              text: 'Example text message 3.',
              sender: {
                id: 3,
                name: 'Sender 4'
              }
            },
            {
              id: 3,
              time: Date.now() - 305000,
              text: 'Example text message 4.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 4,
              time: Date.now() - 303000,
              text: 'Example text message 5.',
              sender: {
                id: 3,
                name: 'Sender 4'
              }
            },
            {
              id: 5,
              time: Date.now() - 300000,
              text: 'Example text message 6. Example text message 6. Example text message 6. Example text message 6.',
              sender: {
                id: 3,
                name: 'Sender 4'
              }
            },
          ]
        },
        {
          id: 3,
          name: 'Group 4',
          messages: [
            {
              id: 0,
              time: Date.now() - 30000,
              text: 'Example text message 1.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 1,
              time: Date.now() - 20000,
              text: 'Example text message 2.',
              sender: {
                id: 4,
                name: 'Sender 5'
              }
            },
          ]
        },
      ]
    }
  }

  /**
   *  Method to find the messages for the current group.
   *  @returns  array
   */
  currentGroupMessages () {
    for (const group of this.state.groups) {
      if (group.id === this.state.currentGroup) return group.messages
    }

    // Default to an empty array.
    return []
  }

  // /**
  //  *  Method to send a message.
  //  */
  // sendMessage () {
  //   this.state
  // }

  // /**
  //  *  
  //  */
  // selectGroup () {

  // }

  render () {
    return (
      <div className="app">
        <main> 
          <ChatGroupList
            groups={this.state.groups}
            currentGroup={this.state.currentGroup}
          />
          <ChatBox 
            messages={this.currentGroupMessages()}
            currentSender={this.state.currentSender}
            // sendMessage={this.sendMessage}
          />
        </main>
      </div>
    )
  }
}
