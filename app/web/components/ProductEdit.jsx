import React from 'react'

import dialogsStyles from '../styles/dialogs'

const ProductEdit = ({ open, product, onSave, onCancel }) => {
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
      title="Dialog With Custom Width"
      actions={actions}
      modal={true}
      className={dialogsStyles.fullscreen}
      open={open}
    >
      This dialog spans the entire width of the screen.
    </Dialog>
  )
}

export default ProductEdit
