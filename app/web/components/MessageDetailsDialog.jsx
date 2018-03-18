import React from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

const MessageDetailsDialog = ({ message, onDone, open }) => {
  const actions = [
    <FlatButton
      label="Done"
      onClick={onDone}
      primary={true}
    />
  ]

  return (
    <Dialog 
      actions={actions}
      title={`Message from: ${message.name}`}
      modal={false}
      open={open}
      onRequestClose={onDone}
    >
      <h5>From</h5>
      <h4>{message.name} ({message.email})</h4>
      <h5>Message</h5>
      <p>{message.message}</p>
    </Dialog>
  )
}

MessageDetailsDialog.propTypes = {
  message: PropTypes.object.isRequired,
  onDone: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default MessageDetailsDialog

