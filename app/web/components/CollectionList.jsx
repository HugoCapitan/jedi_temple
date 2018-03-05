import React from 'react'
import PropTypes from 'prop-types'

import Avatar from 'material-ui/Avatar'
import IconActionDelete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import { List, ListItem } from 'material-ui/List'

const CollectionList = ({ items, onSelect, onRemove }) => {
  const removeButton = prodID => (
    <IconButton onClick={() => { onDelete(prodID) }}>
      <IconActionDelete />
    </IconButton>
  )

  return (
    <List>
      {items.map((item, index) => (
        <ListItem 
          key={index}
          primaryText={item.primaryText}
          secondaryText={item.secondaryText}
          secondaryTextLines={item.secondaryTextLines}
          leftAvatar={item.avatar}
          rightIconButton={ deleteButton(item._id) }
          onClick={ () => onSelect(item._id) }
        />
      ))}
    </List>
  )
}

CollectionList.propTypes = {
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func
}

export default CollectionList
