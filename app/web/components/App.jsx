import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'
import SnackBar from 'material-ui/Snackbar'

import CurrentSection from '../containers/CurrentSection'

import { toggleDrawer } from '../actions'

const Component = ({ store, error, toggleDrawer }) => (
  <div>
    <AppBar 
      title={store != 'general' ? _.capitalize(store) : 'Heberto Sites Admin' }
      onLeftIconButtonClick={toggleDrawer}
    />
    <CurrentSection />
  </div>
)

const mapStateToProps = state => ({
  store: state.ui.route,
  error: state.ui.requestError
})

const mapDispatchToProps = dispatch => ({
  toggleDrawer() { dispatch(toggleDrawer()) }
})

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)

export default App
