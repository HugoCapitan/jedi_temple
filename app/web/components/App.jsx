import React from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'

import { toggleDrawer } from '../actions'

import SideBar from './SideBar'
import ProductListHeader from './ProductListHeader'

import testStyles from '../styles/test'

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
      </div>
    </div>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleDrawer() { dispatch(toggleDrawer()) }
})

const App = connect(null, mapDispatchToProps)(AppComponent)

export default App
