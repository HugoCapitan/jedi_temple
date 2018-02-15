import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
}

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
      contentStyle={customContentStyle}
      open={open}
    >
      <TextField
        value={product.name}
        floatingLabelText="Name"
      />
    </Dialog>
  )
}

export default ProductEdit
