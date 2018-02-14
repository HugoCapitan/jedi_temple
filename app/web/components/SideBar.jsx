import React from 'react'
import Drawer  from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

const SideBar = ({  }) => (
  <Drawer
    docked={false}
    width={200}
    open={true}
    onRequestChange={(open) => this.setState({open})}
  >
    <p>Hi</p>
    <p>Hello</p>
  </Drawer>
)

export default SideBar
