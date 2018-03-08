import React from 'react'
import PropTypes from 'prop-types'

import Paper from 'material-ui/Paper'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'

import TileHeader from './TileHeader'

import tableStyles from '../styles/table'

const TableTile = ({ actions, classes, columns, items, title }) => (
  <Paper className={classes}>
    <TileHeader 
      addAction={actions.add}
      backAction={actions.back}
      configAction={actions.config}
      title={title}
    />
    <Table className={tableStyles['tile-table']} >
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
        {columns.map((col, ind) => 
          <TableHeaderColumn key={ind}>{col.display}</TableHeaderColumn>
        )}
        </TableRow>        
      </TableHeader>
      <TableBody
        displayRowCheckbox={false}
        showRowHover={true}
        stripedRows={false}
      >
      {items.map((item, ind) => 
        <TableRow key={ind}>
        {columns.map((col, ind) => 
          <TableRowColumn key={ind}>{item[col.field]}</TableRowColumn>          
        )}
        </TableRow>
      )}
      </TableBody>
    </Table>
  </Paper>
)

TableTile.propTypes = {
  actions: PropTypes.shape({
    add: PropTypes.func,
    back: PropTypes.func,
    config: PropTypes.func,
    select: PropTypes.func,
    remove: PropTypes.func
  }),
  classes: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
}

export default TableTile
