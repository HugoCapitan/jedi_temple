import React from 'react'

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'
import FontIcon from 'material-ui/FontIcon'

const ProductListHeader = ({ title, leftIcon, rightIcon }) => (
  <Toolbar>
    <ToolbarGroup firstChild={!!leftIcon ? true : false} >
      {!!leftIcon ? leftIcon : ''}
      <ToolbarTitle text={title} />
    </ToolbarGroup>
    <ToolbarGroup lastChild={true}>
      {!!rightIcon ? rightIcon : ''}
    </ToolbarGroup>        
  </Toolbar>
)

export default ProductListHeader
