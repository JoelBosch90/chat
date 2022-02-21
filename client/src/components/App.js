import React from 'react'
import ChatGroupList from './ChatGroupList.js'
import ChatBox from './ChatBox.js'
import './App.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSender: {
        id: 1,
        name: 'Sender 1'
      },
      currentGroup: 3,
      groups: [
        {
          id: 1,
          name: 'Group 1',
          messages: [
            {
              id: 6,
              time: Date.now(),
              text: 'Example text message 6.',
              sender: {
                id: 2,
                name: 'Sender 2'
              }
            },
            {
              id: 5,
              time: Date.now() - 3000,
              text: 'Example text message 5.',
              sender: {
                id: 2,
                name: 'Sender 2'
              }
            },
            {
              id: 4,
              time: Date.now() - 5000,
              text: 'Example text message 4.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
            {
              id: 3,
              time: Date.now() - 13000,
              text: 'Example text message 3.',
              sender: {
                id: 2,
                name: 'Sender 2'
              }
            },
            {
              id: 2,
              time: Date.now() - 23000,
              text: 'Example text message 2.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
            {
              id: 1,
              time: Date.now() - 30000,
              text: 'Example text message 1.1.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
          ]
        },
        {
          id: 2,
          name: 'Group 1',
          messages: [
            {
              id: 2,
              time: Date.now() - 60000,
              text: 'Example text message 2.',
              sender: {
                id: 3,
                name: 'Sender 3'
              }
            },
            {
              id: 1,
              time: Date.now() - 65000,
              text: 'Example text message 1.2.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
          ]
        },
        {
          id: 3,
          name: 'Group 3',
          messages: [
            {
              id: 6,
              time: Date.now() - 300000,
              text: 'Example text message 6. Example text message 6. Example text message 6. Example text message 6.',
              sender: {
                id: 4,
                name: 'Sender 4'
              }
            },
            {
              id: 5,
              time: Date.now() - 303000,
              text: 'Example text message 5.',
              sender: {
                id: 4,
                name: 'Sender 4'
              }
            },
            {
              id: 4,
              time: Date.now() - 305000,
              text: 'Example text message 4.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
            {
              id: 3,
              time: Date.now() - 306000,
              text: 'Example text message 3.',
              sender: {
                id: 4,
                name: 'Sender 4'
              }
            },
            {
              id: 2,
              time: Date.now() - 312000,
              text: 'Example text message 2.',
              sender: {
                id: 0,
                name: 'Sender 1'
              }
            },
            {
              id: 1,
              time: Date.now() - 313000,
              text: 'Example text message 1.3.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
          ]
        },
        {
          id: 4,
          name: 'Group 4',
          messages: [
            {
              id: 2,
              time: Date.now() - 20000,
              text: 'Example text message 2.',
              sender: {
                id: 5,
                name: 'Sender 5'
              }
            },
            {
              id: 1,
              time: Date.now() - 30000,
              text: 'Example text message 1.4.',
              sender: {
                id: 1,
                name: 'Sender 1'
              }
            },
          ]
        },
      ]
    }

    // Make sure that we bind the send methods that we pass to the child
    // components to the state of this component.
    this.sendMessage = this.sendMessage.bind(this)
    this.selectGroup = this.selectGroup.bind(this)
  }

  /**
   *  Method to find the messages for the current group.
   *  @returns  array
   */
  currentGroupMessages () {
    
    // Look through the groups to find the one that matches the ID of the
    // current group. Then return its messages.
    for (const group of this.state.groups) {
      if (group.id === this.state.currentGroup) return group.messages
    }

    // Default to an empty array.
    return []
  }

  /**
   *  Method to send a message.
   *  @todo   This currently only updates state. Later on the message will have
   *          to come from the server to have a reliable ID.
   *  @param  {string}  text  New message to send.
   */
  sendMessage (text) {
    this.setState(state => {
      return {
        // We only need to update the groups.
        groups: state.groups.map(group => {

          // All except the current group can stay the same.
          if (group.id != state.currentGroup) return group

          // Construct the new ID by finding the largest ID in the current set
          // of messages, then add one.
          const id = group.messages.reduce((id, message) => {
            return id > message.id ? id : message.id
          }, 1) + 1

          // Add the new message, ignore everything else.
          return {
            ...group,
            messages: [

              // Add the new message to the beginning of the array.
              {
                id,
                time: Date.now(),
                text,
                sender: state.currentSender,
              },

              // Keep the other messages.
              ...group.messages
            ]
          }
        })
      }
    })
  }

  /**
   *  Method to select a new group.
   *  @param  {integer} id  ID of the group to select.
   */
  selectGroup (id) {
    this.setState({
      currentGroup: id
    })
  }

  render () {
    return (
      <div className="app">
        <main> 
          <ChatGroupList
            groups={this.state.groups}
            currentGroup={this.state.currentGroup}
            selectGroup={this.selectGroup}
          />
          <ChatBox 
            messages={this.currentGroupMessages()}
            currentSender={this.state.currentSender}
            sendMessage={this.sendMessage}
          />
        </main>
      </div>
    )
  }
}
