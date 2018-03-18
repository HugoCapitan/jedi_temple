import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import IconNavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert'
import IconContentFilterList from 'material-ui/svg-icons/content/filter-list'
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
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'

import MessageDetailsDialog from './MessageDetailsDialog'

import tableStyles from '../styles/table'

class MessagesTile extends React.Component {
  constructor(props) {
    super(props)

    this.state = { selected: [], details: undefined, show: 'unread' }

    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleReadUnread = this.handleReadUnread.bind(this)
    this.handleRowSelection = this.handleRowSelection.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.handleShow = this.handleShow.bind(this)
  }

  handleCellClick(rn, cid) {
    if (cid != -1)
      this.setState({ details: rn, selected: [rn] })
    else 
      this.setState({
        selected: _.includes(this.state.selected, rn) 
          ? this.state.selected.filter(item => item != rn)
          : [ ...this.state.selected, rn ]
      })
  }

  handleCloseDialog() {
    this.setState({ details: undefined, selected: [] })
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
  
  handleShow(show) {
    this.setState({ show })
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
                  <IconContentFilterList />
                </IconButton>
              }
              onItemClick={(e, c) => {this.handleShow(c.props.value)}}
            >
              <MenuItem value="read" primaryText="Show Read" />
              <MenuItem value="unread" primaryText="Show Unread" />
            </IconMenu>
            <IconMenu 
              iconButtonElement={
                <IconButton>
                  <IconNavigationMoreVert />
                </IconButton>
              }
              onItemClick={this.handleReadUnread}
            >
              <MenuItem value="read" primaryText="Mark Selected As Read" />
              <MenuItem value="readall" primaryText="Mark All As Read" />
              <MenuItem value="unread" primaryText="Mark Selected As Unread" />
              <MenuItem value="unreadAll" primaryText="Mark All As Unread" />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
        <Table
          className={tableStyles['pointer-table']}
          multiSelectable={true}
          onCellClick={this.handleCellClick}
          onRowSelection={this.handleRowSelection}
          allRowsSelected={false}
        >
          <TableHeader
            displaySelectAll={false}
          >
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
          {this.props.messages
            .filter((mess) => this.state.show === 'read' ? mess.read : !mess.read )
            .map((mess, ind) => 
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
        { this.state.details != undefined ?
          <MessageDetailsDialog message={this.props.messages[this.state.details]} open={true} onDone={this.handleCloseDialog}/> :
          ''
        }
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

