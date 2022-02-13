import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './ChatBoxInput.scss'

export default function ChatBoxInput() {
  return (
    <div className="chatbox-input">
      <input placeholder="Write a message..." />
      <button>
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  )
}
