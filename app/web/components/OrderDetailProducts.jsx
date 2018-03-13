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

class OrderDetailProducts extends React.Component { 
  constructor(props) {
    super(props)
    this.state = { selected: undefined }

    this.handleSelection = this.handleSelection.bind(this)
  }

  handleSelection(row) {
    console.log(row)
  }
  
  render() {
    return (
      <div className={gridStyles['flex-col__container']}>
        <div className={gridStyles['flex-col__half']}> 
          <Table
            onRowSelection={this.handleSelection}
          >
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
              {this.props.products.map((prod, index) =>  
                <TableRow>
                  <TableRowColumn> {prod.name} </TableRowColumn>
                  <TableRowColumn> {prod.quantity} </TableRowColumn>
                  <TableRowColumn> US$ {prod.price} </TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className={gridStyles['flex-col__half']}> 
        </div>
      </div>
    )
  }
}

OrderDetailProducts.propTypes = {
  products: PropTypes.array.isRequired
}

export default OrderDetailProducts

