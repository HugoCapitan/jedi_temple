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
    if (this.state.selected && this.state.selected.name === this.props.products[selectedRow].name)
      this.setState({ selected: undefined })
    else 
      this.setState({ selected: this.props.products[selectedRow] })
  }
  
  render() {
    return (
      <div className={gridStyles['flex-col__container']}>
        <div className={gridStyles['flex-col__half']}> 
          <Table
            onRowSelection={this.handleSelection}
            className={tableStyles['pointer-table']}
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
              showRowHover={true}
            >
              {this.props.products.map((prod, index) =>  
                <TableRow key={index} selected={this.state.selected && this.state.selected.name === prod.name}>
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
                  <TableRowColumn> Custom Fields </TableRowColumn>
                  <TableRowColumn> </TableRowColumn>
                </TableRow> 
             </TableBody>
            </Table>           
            <Table className={tableStyles['indented-table']}>
              <TableBody
                displayRowCheckbox={false}
              >
              {this.state.selected.customs.map((custom, cindex) => 
                <TableRow key={cindex}>
                  <TableRowColumn>
                    {custom.key}
                  </TableRowColumn>
                  <TableRowColumn>
                    {custom.value}
                  </TableRowColumn>
                </TableRow>
              )}
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

