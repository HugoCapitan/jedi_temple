import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import ListHeader from './ListHeader'
import CollectionList from './CollectionList'

import dialogStyles from '../styles/dialogs'

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
}

 const ProductsConfig = ({ customs, onCustomSelect, onCustomAdd, onDone }) => {
  const actions = [
    <FlatButton
      label="Done"
      primary={true}
      onClick={onDone}
    />
  ]

  return (
    <Dialog
        actions={actions}
        bodyStyle={ {paddingLeft: '0', paddingRight: '0'} }
        contentStyle={customContentStyle}
        modal={true}
        open={true}
        title={'Customize Products Fields'}
    >

      <div className={dialogStyles['small-span']}>
        <ListHeader title="Fields" onAdd={onCustomAdd} />
        <CollectionList items={customs} />
      </div>

      <div className={dialogStyles['big-span']}>
        bye
      </div>

    </Dialog>
  )
}


export default ProductsConfig
