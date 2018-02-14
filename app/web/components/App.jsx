import React from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'

import SideBar from './SideBar'

import { toggleDrawer } from '../actions'

const AppComponent = ({ toggleDrawer }) => (
  <div>
    <AppBar
      title="Heberto Sites Admin"
      onLeftIconButtonClick={toggleDrawer}
    />
    <SideBar />
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleDrawer() { dispatch(toggleDrawer()) }
})

const App = connect(null, mapDispatchToProps)(AppComponent)

export default App
