import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import Snackbar from 'material-ui/Snackbar'

import { toggleDrawer } from '../actions'

import ProductEdit       from '../components/ProductEdit'
import ProductListHeader from '../components/ProductListHeader'
import ProductList       from '../components/ProductList'

import testStyles from '../styles/test'

const EStoreComponent = ({ estore, products, error, toggleDrawer }) => (
  <div>
    <div className="content">
      <div className={testStyles['product-list']}>
        <ProductListHeader title="Products"/>
        <ProductList products={products} />
      </div>
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  estore: ownProps.estore,
  products: filterProducts(ownProps.estore, state.products),
  error: state.ui.fetchingError
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleDrawer() { dispatch(toggleDrawer()) }
})

const EStore = connect(
  mapStateToProps, 
  mapDispatchToProps
)(EStoreComponent)

export default EStore

function filterProducts (estore, allProducts) {
  return Object.values(allProducts.items)
    .filter((product, acc) => product.store == estore)
}
