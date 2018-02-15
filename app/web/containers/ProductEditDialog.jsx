import React from 'react'
import { connect } from 'react-redux'


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
  product: { ...state.products.items[state.ui.itemDialog.itemID] },
  customs: state.customFields.filter(custom => customField.store === state.ui.route)
})

const mapDispatchToProps = dispatch => ({
  onSave(product) { dispatch() },
  onCancel(product) { dispatch() }
})

const ProductEditDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEditDialogComponent)

export default ProductEditDialog
