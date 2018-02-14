import React from 'react'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'
import Drawer  from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'

import { changeDrawerOpen } from '../actions'

const CloseIcon = <IconButton> <FontIcon className="material-icons">close</FontIcon> </IconButton>

const SideBarComponent = ({ open, changeOpen }) => (
  <Drawer
    docked={false}
    width={200}
    open={open}
    onRequestChange={(open) => { changeOpen(open) }}
  >
    <AppBar 
      title="Sites" 
      iconElementRight={CloseIcon} 
      iconClassNameLeft="display-none"
      onRightIconButtonClick={() => {changeOpen(false)}}
    />
    <MenuItem>Guide</MenuItem>
    <MenuItem>Kampamocha</MenuItem>
    <MenuItem>TuchaDesigns</MenuItem>
    <MenuItem>Unahil</MenuItem>
  </Drawer>
)

const mapStateToProps = (state, ownProps) => ({
  open: state.ui.drawerOpen
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeOpen(open) { dispatch(changeDrawerOpen(open)) }
})

const SideBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBarComponent)

export default SideBar
