import React from 'react'
import PropTypes from 'prop-types'

import IconButton from 'material-ui/IconButton'
import IconNavigationBack from 'material-ui/svg-icons/navigation/arrow-back'
import IconContentAdd from 'material-ui/svg-icons/content/add-circle-outline'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar/Toolbar'

const TileHeader = ({ title, addAction, backAction }) => (
  <Toolbar>
    <ToolbarGroup firstChild={!!backAction} >
      { !!backAction ? 
        <IconButton onClick={backAction}>
          <IconNavigationBack />
        </IconButton>
        : ''
      }
      <ToolbarTitle text={title} />
    </ToolbarGroup>
    <ToolbarGroup lastChild={true}>
      { !!backAction ? 
        <IconButton onClick={addAction}>
          <IconContentAdd />
        </IconButton>
        : ''
      }
    </ToolbarGroup>
  </Toolbar>
)

TileHeader.propTypes = {
  title: PropTypes.string.isRequired,
  addAction: PropTypes.func,
  backAction: PropTypes.func
}

export default TileHeader
