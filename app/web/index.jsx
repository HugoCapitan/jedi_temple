import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import App from './components/App'
import { setAuthToken } from './actions'
import configureStore from './configureStore'
import styles from './styles/base.css'

const store = configureStore()
const token = document.getElementById('root').getAttribute('token')
store.dispatch(setAuthToken(token))

const MaterialApp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
)

const renderApp = () => {
  render(
    <Provider store={store}>
      <MaterialApp />
    </Provider>,
    document.getElementById('root')
  )
}

if (module.hot) {
  module.hot.accept('./components/App', () => {
    renderApp()
  })
}

renderApp()
