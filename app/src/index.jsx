import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'

render(
  <App />,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept(App, () => {
    <App />,
    document.getElementById('root')
  })
}