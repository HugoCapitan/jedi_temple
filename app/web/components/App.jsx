import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'
import SnackBar from 'material-ui/Snackbar'

import CurrentSection from '../containers/CurrentSection'

import { toggleDrawer } from '../actions'

const AppComponent = ({ store, error, toggleDrawer }) => (
  <div>
    <AppBar 
      title={store != 'general' ? _.capitalize(store) : 'Heberto Sites Admin' }
      onLeftIconButtonClick={toggleDrawer}
    />
    <CurrentSection />
  </div>
)

AppComponent.propTypes = {
  store: PropTypes.any,
  error: PropTypes.any,
  toggleDrawer: PropTypes.func.isRequired
}

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
)(AppComponent)

export default App
