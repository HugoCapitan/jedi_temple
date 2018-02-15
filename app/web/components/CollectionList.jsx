import React from 'react'

import Avatar from 'material-ui/Avatar'
import { List, ListItem } from 'material-ui/List'
import IconContentModeEdit from 'material-ui/svg-icons/editor/mode-edit'

const CollectionList = ({ items, onEdit }) => (
  <div>
    <List>
      {items.map((item, index) => (
        <ListItem 
          key={index}
          primaryText={item.primaryText}
          secondaryText={item.secondaryText}
          secondaryTextLines={2}
          leftAvatar={<Avatar src={item.avatar} />}
          rightIcon={<IconContentModeEdit />}
          onClick={ () => onEdit(item._id) }
        />
      ))}
    </List>
  </div>
)

export default CollectionList
