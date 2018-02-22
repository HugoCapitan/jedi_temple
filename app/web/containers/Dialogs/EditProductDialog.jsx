import React from 'react'
import { connect } from 'react-redux'

import Dialog      from 'material-ui/Dialog'

import { closeItemDialog, requestProductUpdate, requestProductAdd } from '../../actions'

import EditProductForm from '../../components/forms/EditProductForm'

const component = ({ open, title, product, customs, onSave, onUpdate, onCancel }) => {
  const formActions = [{
    label: 'Cancel',
    onClick: onCancel
  }, {
    label: 'Save',
    onClick: title === 'New Product' ? onSave : onUpdate
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

const mapStateToProps = state => ({
  open: state.ui.itemDialog.open,
  title: state.ui.itemDialog.itemID ? 'Edit Product' : 'New Product',
  product: getProduct(state.products.items, state.ui.itemDialog.itemID, state.ui.route),
  customs: Object.values(state.customFields.items).filter(custom => custom.store === state.ui.route)
})

const mapDispatchToProps = dispatch => ({
  onSave(newProduct) { dispatch(requestProductAdd(newProduct)) },
  onUpdate(newProduct, oldProduct) { dispatch(requestProductUpdate(newProduct, oldProduct)) },
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
    : { customs: [], description: '', images: [], name: '', price: '', stock: '', store: route }
  return { ...foundProduct }
}
