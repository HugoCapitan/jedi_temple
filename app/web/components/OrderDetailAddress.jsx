import React from 'react'
import PropTypes from 'prop-types'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'

import gridStyles from '../styles/grid'
import tableStyles from '../styles/table'

const OrderDetailAddress = ({ address }) => (
  <Table>
    <TableBody
      displayRowCheckbox={false}
    >
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn>Name: </TableRowColumn>
        <TableRowColumn>{address.name}</TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn>Email: </TableRowColumn>
        <TableRowColumn>{address.email}</TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn>Address Line 1: </TableRowColumn>
        <TableRowColumn>{address.address_line_1}</TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn>Address Line 2: </TableRowColumn>
        <TableRowColumn>{address.address_line_2}</TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn>City: </TableRowColumn>
        <TableRowColumn>{address.city}</TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn>State: </TableRowColumn>
        <TableRowColumn>{address.state}</TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn>Country: </TableRowColumn>
        <TableRowColumn>{address.country}</TableRowColumn>
      </TableRow>
    </TableBody>
  </Table>
)

OrderDetailAddress.propTypes = {
  address: PropTypes.object.isRequired
}

export default OrderDetailAddress

