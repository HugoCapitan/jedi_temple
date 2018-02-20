import React from 'react'

import Dialog     from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField  from 'material-ui/TextField'

const SimpleInputDialog = ({ open, title, value, onDone, onCancel }) => {
  const customStyles = {
    width: 'auto',
    display: 'inline-block',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }

  const actions = [
    <FlatButton
      label="Cancel"
      onClick={onCancel}
    />,
    <FlatButton
      label="Done"
      onClick={onDone}
      primary={true}   
    />
  ]
  
  return (
    <Dialog
      actions={actions}
      open={open}
      title={title}
      contentStyle={customStyles}
    >
      <TextField 
      />
    </Dialog>
  )
}

export default SimpleInputDialog
