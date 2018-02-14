import React from 'react'

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'
import IconEditorModeEdit from  'material-ui/svg-icons/editor/mode-edit'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

const ProductListHeader = ({ title, onEdit, onAdd }) => (
  <Toolbar>
    <ToolbarGroup>
      <ToolbarTitle text={title} />
    </ToolbarGroup>
    <ToolbarGroup lastChild={true}>
      <IconButton touch={true} onClick={onEdit}>
        <IconEditorModeEdit />
      </IconButton>
      <IconButton touch={true} onClick={onAdd}>
        <IconContentAddCircle />
      </IconButton>
    </ToolbarGroup>        
  </Toolbar>
)

export default ProductListHeader
