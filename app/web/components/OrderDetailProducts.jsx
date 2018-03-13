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

class OrderDetailProducts extends React.Component { 
  constructor(props) {
    super(props)
    this.state = { selected: undefined }

    this.handleSelection = this.handleSelection.bind(this)
  }

  handleSelection(rows) {
    const selectedRow = rows[0]
    this.setState({ selected: this.props.products[selectedRow] })
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
        { this.state.selected ? 
          <div className={gridStyles['flex-col__half']}> 
            <Table
              onRowSelection={this.handleSelection}
            >
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Product Details: {this.state.selected.name} </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={false}
              >
                <TableRow className={tableStyles['black-first-column']}>
                  <TableRowColumn> Name </TableRowColumn>
                  <TableRowColumn> {this.state.selected.name} </TableRowColumn>
                </TableRow>
                <TableRow className={tableStyles['black-first-column']}>
                  <TableRowColumn> Code </TableRowColumn>
                  <TableRowColumn> {this.state.selected.code} </TableRowColumn>
                </TableRow>
                <TableRow className={tableStyles['black-first-column']}>
                  <TableRowColumn> Price </TableRowColumn>
                  <TableRowColumn> {this.state.selected.price} </TableRowColumn>
                </TableRow>
                <TableRow className={tableStyles['black-first-column']}>
                  <TableRowColumn> Quantity </TableRowColumn>
                  <TableRowColumn> {this.state.selected.quantity} </TableRowColumn>
                </TableRow>
                <TableRow className={tableStyles['black-first-column']}>
                  <TableRowColumn> Customs </TableRowColumn>
                  <TableRowColumn> </TableRowColumn>
                </TableRow>
             </TableBody>
            </Table>           
          </div>
          :
          ''
        }
      </div>
    )
  }
}

OrderDetailProducts.propTypes = {
  products: PropTypes.array.isRequired
}

export default OrderDetailProducts

