import React from 'react'
import PropTypes from 'prop-types'

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'

class MessagesTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Paper></Paper>
    )
  }
}

MessagesTile.propTypes = {
  messages: PropTypes.array.isRequired,
  onSelect: PropTypes.arrat.onSelect,
  classes: PropTypes.string.isRequired,
}

export default MesssagesTile

