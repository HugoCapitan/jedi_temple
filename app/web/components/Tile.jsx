import React from 'react'
import PropTypes from 'prop-types'

const Tile = ({ actions, items, size, title }) => (
  <div>
    
  </div>
)

Tile.propTypes = {
  actions: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  size: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default Tile
