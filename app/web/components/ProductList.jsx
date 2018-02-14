import React from 'react'

import Avatar from 'material-ui/Avatar'
import { List, ListItem } from 'material-ui/List'
import IconContentModeEdit from 'material-ui/svg-icons/editor/mode-edit'

const ProductList = ({ products, editProduct }) => (
  <div>
    <List>
      {products.map((product, index) => (
        <ListItem 
          key={index}
          primaryText={product.name}
          secondaryText={<p>US ${product.price} <br /> Stock: {product.stock}</p>}
          secondaryTextLines={2}
          leftAvatar={<Avatar src={"http://lorempixel.com/200/200/people/" + index} />}
          rightIcon={<IconContentModeEdit />}
          onClick={editProduct}
        />
      ))}
    </List>
  </div>
)

export default ProductList
