import React from 'react'
import { connect } from 'react-redux'

import { openItemDialog } from '../actions'

import CollectionList    from '../components/CollectionList'
import ProductListHeader from '../components/ProductListHeader'
import ProductEditDialog from './ProductEditDialog'

import testStyles from '../styles/test'

const ProductsSectionComponent = ({ products, onAdd, onConfig, onEdit }) => (
  <div className="content">
    <div className={testStyles['product-list']}>
      <ProductListHeader title="Products" onAdd={onAdd} onConfig={onConfig} />
      <CollectionList items={products} onEdit={onEdit} />
    </div>

    <ProductEditDialog />
  </div>
)

const mapStateToProps = state => ({
  products: filterProducts(state.products.items, state.ui.route)
})

const mapDispatchToProps = dispatch => ({
  onAdd()    { dispatch(openItemDialog('Product', '')) },
  onConfig() { dispatch(openConfigDialog('Product')) },
  onEdit(id) { dispatch(openItemDialog('Product', id)) }
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
      avatar: product.images[0].url
    })) 
}
