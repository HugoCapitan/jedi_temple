import React from 'react'
import { connect } from 'react-redux'

import { openItemDialog, requestProductRemove } from '../actions'

import CollectionList    from '../components/CollectionList'

import ProductListHeader     from '../components/ProductListHeader'
import EditProductDialog     from './dialogs/EditProductDialog'
import CustomsSettingsDialog from './dialogs/CustomsSettingsDialog'

import testStyles from '../styles/test'

const ProductsSectionComponent = ({ products, onAdd, onConfig, onEdit, onDelete }) => (
  <div className="content">
    <div className={testStyles['product-list']}>
      <ProductListHeader title="Products" onAdd={onAdd} onConfig={onConfig} />
      <CollectionList items={products} onEdit={onEdit} onDelete={onDelete} />
    </div>

    <EditProductDialog />
    <CustomsSettingsDialog />
  </div>
)

const mapStateToProps = state => ({
  products: filterProducts(state.products.items, state.ui.route)
})

const mapDispatchToProps = dispatch => ({
  onAdd()    { dispatch(openItemDialog('Product', '')) },
  onConfig() { dispatch(openConfigDialog('Product')) },
  onEdit(id) { dispatch(openItemDialog('Product', id)) },
  onDelete(productID) { dispatch(requestProductRemove(productID)) }
})

const ProductsSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsSectionComponent)

export default ProductsSection


function filterProducts (allProducts, route) {
  return Object.values(allProducts)
    .filter((product, acc) => product.store == route)
    .map(product => ({
      ...product, 
      primaryText: product.name, 
      secondaryText: <p>US ${product.price}<br />Stock: {product.stock}</p>,
      // avatar: product.images[0].url
    })) 
}
