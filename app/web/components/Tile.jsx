import React from 'react'
import PropTypes from 'prop-types'

import Paper from 'material-ui/Paper'

import CollectionList from './CollectionList'
import TileHeader from './TileHeader'

const Tile = ({ actions, classes, items, title }) => (
  <Paper className={classes} >
    <TileHeader
      addAction={actions.add}
      backAction={actions.back}
      configAction={actions.config}
      title={title}
    />
    <CollectionList 
      items={items}
      onRemove={actions.remove}
      onSelect={actions.select}
    />
  </Paper>
)

Tile.propTypes = {
  actions: PropTypes.shape({
    add: PropTypes.func,
    back: PropTypes.func,
    config: PropTypes.func,
    select: PropTypes.func,
    remove: PropTypes.func,
  }).isRequired,
  classes: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
}

export default Tile
