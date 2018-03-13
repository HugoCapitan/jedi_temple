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

const OrderDetailProducts = ({ products }) => (
  <Table>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn>Product Name</TableHeaderColumn>
        <TableHeaderColumn>Quantity</TableHeaderColumn>
        <TableHeaderColumn>Price</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody
      displayRowCheckbox={false}
    >
      {products.map((prod, index) =>  
        <TableRow>
          <TableRowColumn> {prod.name} </TableRowColumn>
          <TableRowColumn> {prod.quantity} </TableRowColumn>
          <TableRowColumn> US$ {prod.price} </TableRowColumn>
          
        </TableRow>
      )}
    </TableBody>
  </Table>
)

OrderDetailProducts.propTypes = {
  products: PropTypes.array.isRequired
}

export default OrderDetailProducts

