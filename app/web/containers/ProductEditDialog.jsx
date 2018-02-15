import React from 'react'
import { connect } from 'react-redux'


import ProductEdit from '../components/ProductEdit'

const ProductEditDialogComponent = ({ open, productID, product, onSave, onCancel }) => (
  <ProductEdit
    open={open}
    title={productID ? 'Edit Product' : 'New Product' }
    product={product}
    onSave={onSave}
    onCancel={onCancel}
  />
)

const mapStateToProps = (state, ownProps) => ({
  open: state.ui.itemDialog.open,
  productID: state.ui.itemDialog.itemID,
  product: { ...state.products.items[state.ui.itemDialog.itemID] } 
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
