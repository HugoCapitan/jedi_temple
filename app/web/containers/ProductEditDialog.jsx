import React from 'react'
import { connect } from 'react-redux'

import { closeItemDialog, requestProductUpdate } from '../actions'

import ProductEdit from '../components/ProductEdit'

const ProductEditDialogComponent = ({ open, productID, product, customs, onSave, onCancel }) => (
  <ProductEdit
    open={open}
    title={productID ? 'Edit Product' : 'New Product' }
    product={product}
    customs={customs}
    onSave={onSave}
    onCancel={onCancel}
  />
)

const mapStateToProps = (state, ownProps) => ({
  open: state.ui.itemDialog.open,
  productID: state.ui.itemDialog.itemID,
  product: getProduct(state.products.items, state.ui.itemDialog.itemID),
  customs: Object.values(state.customFields.items).filter(custom => custom.store === state.ui.route)
})

const mapDispatchToProps = dispatch => ({
  onSave(oldProduct, newProduct) { dispatch(requestProductUpdate(oldProduct, newProduct)) },
  onCancel() { dispatch(closeItemDialog()) }
})

const ProductEditDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEditDialogComponent)

export default ProductEditDialog

function getProduct(products, itemID, route) {
  const foundProduct = !!products[itemID] ? products[itemID] : 
  { customs: [], description: '', images: [], name: '', price: null, stock: null, store: route }
  return { ...foundProduct }
}
