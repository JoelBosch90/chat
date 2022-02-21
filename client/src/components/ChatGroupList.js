import React from 'react'
import ChatGroup from './ChatGroup.js'
import './ChatGroupList.scss'

export default class ChatGroupList extends React.Component {
  render () {

    // Create a list of chat group elements.
    const groups = this.props.groups.map((group) => {
      return (
        <ChatGroup
          key={group.id}
          selected={group.id === this.props.currentGroup}
          name={group.name}
          messages={group.messages}
          onClick={() => this.props.selectGroup(group.id)}
        />
      )
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
