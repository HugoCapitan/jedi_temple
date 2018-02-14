import React from 'react'
import AppBar from 'material-ui/AppBar'
import SideBar from './SideBar'

const App = () => (
  <div>
    <AppBar
      title="Heberto Sites Admin"
      iconClassNameRight="muidocs-icon-navigation-expand-more"
    />
    <SideBar />
  </div>
)

export default App
