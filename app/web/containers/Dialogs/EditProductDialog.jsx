import React from 'react'
import { connect } from 'react-redux'

import Dialog      from 'material-ui/Dialog'

import { closeItemDialog, requestProductUpdate, requestAddProduct } from '../../actions'

import EditProductForm from '../../components/forms/EditProductForm'

const component = ({ open, title, product, customs, onSave, onCancel }) => {
  const formActions = [{
    label: 'Cancel',
    onClick: onCancel
  }, {
    label: 'Save',
    onClick: onSave
  }]

  const customContentStyle = {
    maxWidth: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translate(0, -50%)',
    width: '100%'
  }

  return (
    <Dialog
      autoDetectWindowHeight={false}
      bodyStyle={{ maxHeight: '95%' }}
      contentStyle={customContentStyle}
      modal={true}
      open={open}
      title={title}
    >
      <EditProductForm 
        product={product}
        customs={customs}
        onSave={onSave}
        actions={formActions}
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
