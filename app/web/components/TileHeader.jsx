import React from 'react'
import PropTypes from 'prop-types'

import IconButton from 'material-ui/IconButton'
import IconActionSettings from  'material-ui/svg-icons/action/settings'
import IconContentAdd from 'material-ui/svg-icons/content/add-circle-outline'
import IconNavigationBack from 'material-ui/svg-icons/navigation/arrow-back'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'

const TileHeader = ({ title, addAction, backAction, configAction }) => (
  <Toolbar>
    <ToolbarGroup firstChild={!!backAction}>
      { !!backAction ? 
        <IconButton onClick={backAction}>
          <IconNavigationBack />
        </IconButton>
        : ''
      }
      <ToolbarTitle text={title} />
    </ToolbarGroup>
    <ToolbarGroup lastChild={true}>
      { !!addAction ? 
        <IconButton onClick={addAction}>
          <IconContentAdd />
        </IconButton>
        : ''
      } { !!configAction ? 
        <IconButton onClick={configAction}>
          <IconActionSettings />
        </IconButton>
        : ''
      }
    </ToolbarGroup>
  </Toolbar>
)

TileHeader.propTypes = {
  title: PropTypes.string.isRequired,
  addAction: PropTypes.func,
  backAction: PropTypes.func,
  configAction: PropTypes.func
}

export default TileHeader
