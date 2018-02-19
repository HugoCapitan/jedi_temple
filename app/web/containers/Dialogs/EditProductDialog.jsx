import React from 'react'
import { connect } from 'react-redux'

import Dialog      from 'material-ui/Dialog'
import FlatButton  from 'material-ui/FlatButton'

import { closeItemDialog, requestProductUpdate, requestAddProduct } from '../../actions'

import EditProductForm from '../../components/forms/EditProductForm'

const component = ({ open, title, product, customs, onSave, onCancel }) => {
  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onClick={onCancel}
    />
  ]

  return (
    <Dialog
      title={title}
      actions={actions}
      modal={true}
      contentStyle={{ width: '100%', maxWidth: 'none' }}
      open={open}
    >
      <EditProductForm 
        product={product}
        customs={customs}
        onSave={onSave}
      />
    </Dialog>
  )
}

const mapStateToProps = (state, ownProps) => ({
  open: state.ui.itemDialog.open,
  title: state.ui.itemDialog.itemID ? 'Edit Product' : 'New Product',
  product: getProduct(state.products.items, state.ui.itemDialog.itemID, state.ui.route),
  customs: Object.values(state.customFields.items).filter(custom => custom.store === state.ui.route)
})

const mapDispatchToProps = dispatch => ({
  onSave(oldProduct, newProduct) { state.ui.itemDialog.itemID 
    ? dispatch(requestProductUpdate(oldProduct, newProduct)) 
    : dispatch(requestAddProduct(newProduct)) 
  },
  onCancel() { dispatch(closeItemDialog()) }
})

const EditProductDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default EditProductDialog


function getProduct(products, itemID, route) {
  const foundProduct = !!products[itemID] 
    ? products[itemID]
    : { customs: [], description: '', images: [], name: '', price: undefined, stock: undefined, store: route }
  return { ...foundProduct }
}
