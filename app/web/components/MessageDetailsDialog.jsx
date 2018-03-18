import React from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/Dialog'

const MessageDetailsDialog = ({ message, onDone, open }) => {
  const actions = [
    <FlatButton
      onClick={onDone}
      label="Done"
      primary={true}
    />
  ]

  return (
    <Dialog 
      actions={actions}
      title={`message from ${message.name}`}
      modal={false}
      open={open}
      onRequestClose={onDone}
    >
      <h4>From: {message.email}, with name: {message.name} </h4>
      <h5>Message:</h5>
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

