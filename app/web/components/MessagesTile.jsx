import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import IconNavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert'
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

    this.state = { selected:  [] }

    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleRowSelection = this.handleRowSelection.bind(this)
  }

  handleCellClick(rn, cid) {
    if (cid != -1)
      console.log(rn, cid)
  }

  handleRowSelection(selected) {
    this.setState({ 
      selected: selected === 'all' 
        ? this.props.messages.map((m, i) => i)
        : selected
    })
  }

  render() {
    return (
      <Paper className={this.props.classes}>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="Messages" />
          </ToolbarGroup>
          <ToolbarGroup lastChild={true}>
            <IconMenu 
              iconButtonElement={
                <IconButton>
                  <IconNavigationMoreVert />
                </IconButton>
              }
            >
              <MenuItem value="read" primaryText="Mark Selected As Read" />
              <MenuItem value="unread" primaryText="Mark Selected As Unread" />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
        <Table
          multiSelectable={true}
          onCellClick={this.handleCellClick}
          onRowSelection={this.handleRowSelection}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>
                Email
              </TableHeaderColumn>
              <TableHeaderColumn>
                Message
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
          {this.props.messages.map((mess, i) => 
            <TableRow key={i} selected={_.includes(this.state.selected, i)}>
              <TableRowColumn>
                { mess.email }
              </TableRowColumn>
              <TableRowColumn>
                { mess.message }
              </TableRowColumn>
            </TableRow>
          )}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

MessagesTile.propTypes = {
  messages: PropTypes.array.isRequired,
  onSelect: PropTypes.array.isRequired,
  classes: PropTypes.string.isRequired,
}

export default MessagesTile

