import React from 'react'
import PropTypes from 'prop-types'

import TileHeader from './TileHeader'

const Tile = ({ actions, items, size, title }) => (
  <div>
    <TileHeader 
      title={title}
      addAction={actions.add}
    /> 
  </div>
)

Tile.propTypes = {
  actions: PropTypes.shape({
    add: PropTypes.func,
    select: PropTypes.select,
    remove: PropTypes.func
  }).isRequired,
  items: PropTypes.array.isRequired,
  size: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default Tile
