import React from 'react'

import Avatar from 'material-ui/Avatar'
import { List, ListItem } from 'material-ui/List'
import IconActionDelete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'


const CollectionList = ({ items, onEdit, onDelete }) => {
  const deleteButton = (prodID) => (
    <IconButton onClick={() => { onDelete(prodID) }} >
      <IconActionDelete />
    </IconButton>
  )
  return (
    <div>
      <List>
        {items.map((item, index) => (
          <ListItem 
            key={index}
            primaryText={item.primaryText}
            secondaryText={item.secondaryText}
            secondaryTextLines={2}
            leftAvatar={item.avatar}
            rightIconButton={deleteButton(item._id)}
            onClick={ () => onEdit(item._id) }
          />
        ))}
      </List>
    </div>
  )
}

export default CollectionList
