import React from 'react'
import { connect } from 'react-redux'

import { openItemDialog, changeSection, requestProductRemove } from '../actions'

import CollectionList    from '../components/CollectionList'
import ListHeader        from '../components/ListHeader'
import ProductListHeader from '../components/ProductListHeader'
import EditProductDialog from './dialogs/EditProductDialog'

import sectionStyles from '../styles/section'

const ProductsSectionComponent = ({ products, onAdd, onConfig, onEdit, onDelete }) => (
  <div>
    <div className={sectionStyles['left-list']}>
      <ProductListHeader title="Products" onAdd={onAdd} onConfig={onConfig} />
      <CollectionList items={products} onEdit={onEdit} onDelete={onDelete} />
    </div>

    <div className={sectionStyles['right-list']}>
      <ListHeader title="Orders" />
      {/* <CollectionList items={products} onEdit={onEdit} onDelete={onDelete} /> */}
    </div>

    <EditProductDialog />
  </div>
)

const mapStateToProps = state => ({
  products: filterProducts(state.products.items, state.ui.route)
})

const mapDispatchToProps = dispatch => ({
  onAdd()    { dispatch(openItemDialog('Product', '')) },
  onConfig() { dispatch(changeSection('customs')) },
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
