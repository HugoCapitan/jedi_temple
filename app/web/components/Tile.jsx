import React from 'react'
import PropTypes from 'prop-types'

import Paper from 'material-ui/Paper'

import CollectionList from './CollectionList'
import TileHeader from './TileHeader'

const Tile = ({ actions, goBack, items, size, title }) => (
  <Paper>
    <TileHeader 
      title={title}
      addAction={actions.add}
      backAction={goBack}
      configAction={actions.config}
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
    config: PropTypes.func,
    select: PropTypes.func,
    remove: PropTypes.func
  }).isRequired,
  items: PropTypes.array.isRequired,
  size: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  goBack: PropTypes.func  
}

export default Tile
