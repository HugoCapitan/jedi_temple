import React from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'

import { toggleDrawer } from '../actions'

import SideBar from './SideBar'
import ProductListHeader from './ProductListHeader'
import ProductList from './ProductList'

import testStyles from '../styles/test'

const products = [{name: 'Anillos', price: 549.99, stock: 15}, {name: 'Brazalete', price: 399.99, stock: 24}]

const AppComponent = ({ toggleDrawer }) => (
  <div>
    <AppBar
      title="Heberto Sites Admin"
      onLeftIconButtonClick={toggleDrawer}
    />
    <SideBar />
    <div className="content">
      <div className={testStyles['product-list']}>
        <ProductListHeader title="Products"/>
        <ProductList products={products} />
      </div>
    </div>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleDrawer() { dispatch(toggleDrawer()) }
})

const App = connect(null, mapDispatchToProps)(AppComponent)

export default App
