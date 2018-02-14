import React from 'react'

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'

const ProductListHeader = ({ title, onEdit, onAdd }) => (
  <Toolbar>
    <ToolbarGroup>
      <ToolbarTitle text={title} />
    </ToolbarGroup>
  </Toolbar>
)

export default ProductListHeader
