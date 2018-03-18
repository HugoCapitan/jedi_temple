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
    this.handleReadUnread = this.handleReadUnread.bind(this)
    this.handleRowSelection = this.handleRowSelection.bind(this)
  }

  handleCellClick(rn, cid) {
    if (cid != -1)
      console.log(rn, cid)
    else 
      this.setState({
        selected: _.includes(this.state.selected, rn) 
          ? this.state.selected.filter(item => item != rn)
          : [ ...this.state.selected, rn ]
      })
  }

  handleReadUnread(e, c) {
    console.log(c.props.value)
    console.log(this.state.selected)
  }

  handleRowSelection(selected) {
    if (selected === 'all' || selected === 'none')
      this.setState({
        selected: selected === 'all'
          ? this.props.messages.map((m, i) => i)
          : []
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
              onItemClick={this.handleReadUnread}
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
          allRowsSelected={false}
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
          <TableBody
            deselectOnClickaway={false}
          >
          {this.props.messages.map((mess, ind) => 
            <TableRow key={ind} selected={_.includes(this.state.selected, ind)} > 
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

