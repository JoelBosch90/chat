import React from 'react'
import ChatGroup from './ChatGroup.js'
import './ChatGroupList.scss'

export default class ChatGroupList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

      // Provide some placeholder data.
      // @todo: get actual chat groups to display.
      groups: [
        {
          id: 0,
          opened: false,
        },
        {
          id: 1,
          opened: true,
        },
        {
          id: 2,
          opened: false,
        },
        {
          id: 3,
          opened: false,
        },
        {
          id: 4,
          opened: false,
        },
        {
          id: 5,
          opened: false,
        }
      ]
    }
  }

  render () {

    // Create a list of chat groups.
    const groups = this.state.groups.map((group) => {
      return <ChatGroup key={group.id} opened={group.opened} />
    })

    return (
      <nav className="chatgroup-list">
        <ol>
          {groups}
        </ol>
      </nav>
    )
  }
}
