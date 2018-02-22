import React from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import Snackbar from 'material-ui/Snackbar'
import CircularProgress from 'material-ui/CircularProgress'

import { toggleDrawer } from '../actions'

import SideBar from './SideBar'

import Store from '../containers/Store'

import testStyles from '../styles/test'

const ProgressOutStyle = {
  position: 'absolute',
  top: '0',
  display: 'inline-block',
  width: '80px',
  height: '80px',
  left: '0',
  height: '100%',
  zIndex: '9999',
  width: '100%',
  backgroundColor: '#46464694'
}

const ProgressInStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

const AppComponent = ({ route, error, waiting, toggleDrawer }) => {
  let store = ''

  if (route === 'kampamocha')
    store = <Store estore="kampamocha" />
    
  return (
    <div>
      <AppBar
        title={`Heberto Sites Admin | ${route}`}
        onLeftIconButtonClick={toggleDrawer}
      />
      <SideBar />
      
      {store}
  
      { error ?  
        ( <Snackbar
          open={!!error}
          message={error}
          autoHideDuration={5000}
          action="retry"
          // onRequestClose={}
        /> ) 
        : ''
      }
      { waiting ?  
        ( <CircularProgress size={80} thickness={5} style={ProgressOutStyle} innerStyle={ProgressInStyle} /> ) 
        : ''
      }
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  route: state.ui.route,
  error: state.ui.requestError,
  waiting: state.ui.isRequestOngoing
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleDrawer() { dispatch(toggleDrawer()) }
})

const App = connect(
  mapStateToProps, 
  mapDispatchToProps
)(AppComponent)

export default App
