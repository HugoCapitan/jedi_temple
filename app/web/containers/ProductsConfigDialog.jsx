import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'material-ui/Avatar'
import {
  blue500,
  orange500
} from 'material-ui/styles/colors'

import ProductsConfig from '../components/ProductsConfig'

const mapStateToProps = state => ({
  customs: getCustoms(state.customFields.items, state.ui.route)
})

const mapDispatchToProps = dispatch => ({

})

const ProductsConfigDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsConfig)

export default ProductsConfigDialog


function getCustoms (items, route) {
  return Object.values(items)
    .filter(it => it.store === route)
    .map(it => ({ ...it, primaryText: it.name, avatar: getAvatar(it.type) }))
}

function getAvatar(type) {
  return type === 'string' ? <Avatar backgroundColor={orange500}>S</Avatar> : <Avatar backgroundColor={blue500}>N</Avatar>
}
