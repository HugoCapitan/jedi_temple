import React from 'react'

import Divider from 'material-ui/Divider'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'
import Subheader from 'material-ui/Subheader'
import Toggle from 'material-ui/Toggle'

const CustomFieldEdit = ({}) => (
  <div>
      <List>
        <Subheader>General</Subheader>
        <ListItem primaryText="Type"/>
        <ListItem primaryText="Show in site" rightToggle={<Toggle />} />
        <ListItem primaryText="Allow filter" rightToggle={<Toggle />} />
      </List>
  </div>
)

export default CustomFieldEdit
