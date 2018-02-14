import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import dialogsStyles from '../styles/dialogs'

const ProductEdit = ({ open, title, product, onSave, onCancel }) => {
  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onClick={onCancel}
    />,
    <FlatButton
      label="Submit"
      primary={true}
      onClick={onSave}
    />
  ]

  return (
    <Dialog
      title={title}
      actions={actions}
      modal={true}
      className={dialogsStyles['fullscreen-dialog']}
      open={open}
    >
      This dialog spans the entire width of the screen.
    </Dialog>
  )
}

export default ProductEdit
