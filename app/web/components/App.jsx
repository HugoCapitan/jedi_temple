import React from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import Snackbar from 'material-ui/Snackbar'

import { toggleDrawer } from '../actions'

import SideBar from './SideBar'
import ProductListHeader from './ProductListHeader'
import ProductList from './ProductList'

import testStyles from '../styles/test'

const products = [{name: 'Anillos', price: 549.99, stock: 15}, {name: 'Brazalete', price: 399.99, stock: 24}]

const AppComponent = ({ error, toggleDrawer }) => (
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

    { error ?  
      ( <Snackbar
        open={error}
        message={error}
        autoHideDuration={5000}
        action="retry"
        // onRequestClose={}
      /> ) 
      : ''
    }
    
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  error: state.ui.fetchingError
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleDrawer() { dispatch(toggleDrawer()) }
})

const App = connect(
  mapStateToProps, 
  mapDispatchToProps
)(AppComponent)

export default App
