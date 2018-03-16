import React from 'react'
import PropTypes from 'prop-types' 

import IconButton from 'material-ui/IconButton'
import IconEditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'


import formStyles from '../styles/form'
import tableStyles from '../styles/table'

const OrderDetailGeneral = ({ order, openEditDialog }) => (
  <Table>
    <TableBody
      displayRowCheckbox={false}
      showRowHover={false}
    >
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn> Email </TableRowColumn>
        <TableRowColumn> {order.email} </TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn> Order Code </TableRowColumn>
        <TableRowColumn> {order.order_code} </TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn> Status </TableRowColumn>
        <TableRowColumn> 
          {order.status}  
          <IconButton onClick={openEditDialog} style={{width: '32px', height: '32px', padding: '4px'}} iconStyle={{width: '16px', height: '16px'}}>
            <IconEditorModeEdit />
          </IconButton>
        </TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn> Tracking Number </TableRowColumn>
        <TableRowColumn> {order.tracking_number} </TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn> Shipping Cost </TableRowColumn>
        <TableRowColumn> US$ {order.shipping} </TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn> Total </TableRowColumn>
        <TableRowColumn> US$ {order.total} </TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn> Payment Method </TableRowColumn>
        <TableRowColumn> {order.payment_method} </TableRowColumn>
      </TableRow>
      <TableRow className={tableStyles['black-first-column']}>
        <TableRowColumn> Payment ID </TableRowColumn>
        <TableRowColumn> {order.payment_id} </TableRowColumn>
      </TableRow>
    </TableBody>
  </Table>
)

OrderDetailGeneral.propTypes = {
  order: PropTypes.object.isRequired,
  openEditDialog: PropTypes.func.isRequired
}

export default OrderDetailGeneral

