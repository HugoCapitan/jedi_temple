import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import dialogStyles from '../styles/dialogs'

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
}

 const ProductsConfig = ({ customs, onDone }) => {
  const actions = [
    <FlatButton
      label="Done"
      primary={true}
      onClick={onDone}
    />
  ]

  return (
    <Dialog
        title={'Customize Products Fields'}
        actions={actions}
        modal={true}
        contentStyle={customContentStyle}
        open={true}
    >

      <div className={dialogStyles['small-span']}>
        hi
      </div>

      <div className={dialogStyles['big-span']}>
        bye
      </div>

    </Dialog>
  )
}


export default ProductsConfig
