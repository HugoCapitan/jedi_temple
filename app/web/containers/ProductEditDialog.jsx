import React from 'react'
import { connect } from 'react-redux'

import ProductEdit from '../components/ProductEdit'

const ProductEditDialogComponent = ({ title, open, onSave, onCancel }) => (
  <ProductEdit
    title={title}
    open={open}
  />
)

const mapStateToProps = state => ({
  title: state.ui.productDialog.title,
  open: state.ui.productDialog.open
})

const mapDispatchToProps = dispatch => ({

})

const ProductEditDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEditDialogComponent)

export default ProductEditDialog
