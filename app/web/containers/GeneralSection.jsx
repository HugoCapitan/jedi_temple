import React from 'react'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'

import { openItemDialog, changeSection, requestProductRemove } from '../actions'

import CollectionList    from '../components/CollectionList'
import ListHeader        from '../components/ListHeader'
import ProductListHeader from '../components/ProductListHeader'
import EditProductDialog from './dialogs/EditProductDialog'

import sectionStyles from '../styles/section'

const ProductsSectionComponent = ({ products, orders, onAdd, onConfig, onEdit, onDelete }) => (
  <div>
    <Paper className={[sectionStyles['big-list'], sectionStyles['left-list']].join(' ')}>
      <ListHeader title="Orders" />
      {/* <CollectionList items={products} onEdit={onEdit} onDelete={onDelete} /> */}
    </Paper>

    <Paper className={[sectionStyles['small-list'], sectionStyles['right-list']].join(' ')}>
      <ListHeader title="Messages"/>
      {/* <CollectionList items={products} onEdit={onEdit} onDelete={onDelete} /> */}
    </Paper>

    <Paper className={[sectionStyles['half-list'], sectionStyles['left-list']].join(' ')}>
      <ProductListHeader title="Products" onAdd={onAdd} onConfig={onConfig} />
      <CollectionList items={products} onEdit={onEdit} onDelete={onDelete} />
    </Paper>

    <Paper className={[sectionStyles['half-list'], sectionStyles['right-list']].join(' ')}>
      <ListHeader title="Top Tips"/>
      {/* <CollectionList items={products} onEdit={onEdit} onDelete={onDelete} /> */}
    </Paper>

    <EditProductDialog />
  </div>
)

const mapStateToProps = state => ({
  products: filterProducts(state.products.items, state.ui.route),
  orders: filterOrders(state.orders.items, state.ui.route)
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
    .filter(product => product.store == route)
    .map(product => ({
      ...product, 
      primaryText: product.name, 
      secondaryText: <p>US ${product.price}<br />Stock: {product.stock}</p>,
      // avatar: product.images[0].url
    })) 
}

function filterOrders (allOrders, route) {
  return Object.values(allOrders)
    .filter(order => order.store == route)
}
