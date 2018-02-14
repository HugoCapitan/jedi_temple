import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import Snackbar from 'material-ui/Snackbar'

import { toggleDrawer, openDialog } from '../actions'

import ProductListHeader from '../components/ProductListHeader'
import CollectionList    from '../components/CollectionList'

import ProductEditDialog from './ProductEditDialog'

import testStyles from '../styles/test'

const EStoreComponent = ({ error, estore, products, toggleDrawer, onProductsAdd, onProductsConfig, onProductEdit }) => (
  <div>
    <div className="content">
      <div className={testStyles['product-list']}>
        <ProductListHeader title="Products" onAdd={onProductsAdd} onConfig={onProductsConfig} />
        <CollectionList items={products} onItemEdit={onProductEdit} />
      </div>
    </div>

    <ProductEditDialog />
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  error: state.ui.fetchingError,
  estore: ownProps.estore,
  products: filterProducts(ownProps.estore, state.products)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleDrawer()         { dispatch(toggleDrawer()) },
  onProductsAdd()        { dispatch(openDialog('productEditDialog', {})) },
  onProductsConfig()     { dispatch(openDialog('productsConfigDialog')) },
  onProductEdit(product) { dispatch(openDialog('productEditDialog', product)) }
})

const EStore = connect(
  mapStateToProps, 
  mapDispatchToProps
)(EStoreComponent)

export default EStore

function filterProducts (estore, allProducts) {
  return Object.values(allProducts.items)
    .filter((product, acc) => product.store == estore)
    .map(product => ({
      ...product, 
      primaryText: product.name, 
      secondaryText: <p>US ${product.price}<br />Stock: {product.stock}</p>,
      avatar: product.images[0].url
    })) 
}
