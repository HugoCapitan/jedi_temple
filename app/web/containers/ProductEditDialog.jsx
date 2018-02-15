import React from 'react'
import { connect } from 'react-redux'

import ProductEdit from '../components/ProductEdit'

const ProductEditDialogComponent = ({ open, title, product, onSave, onCancel }) => (
  <ProductEdit
    open={open}
    title={product._id ? 'Edit Product' : 'New Product' }
    product={product}
    onSave={onSave}
    onCancel={onCancel}
  />
)

const mapStateToProps = (state, ownProps) => ({
  open: state.ui.itemDialog.open,
  title: state.ui.productDialog.title,
  product: state.products.items[ownProps.itemID]
})

const mapDispatchToProps = dispatch => ({

})

const ProductEditDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEditDialogComponent)

export default ProductEditDialog
