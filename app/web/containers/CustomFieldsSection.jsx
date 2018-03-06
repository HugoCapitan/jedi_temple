import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Avatar from 'material-ui/Avatar'
import CollectionList from '../components/CollectionList'
import TileHeader from '../components/TileHeader'
import {
  blue500,
  orange500
} from 'material-ui/styles/colors'

import gridStyles from '../styles/grid'

const CustomFieldsSectionComponent = ({  }) => (
  <div className={gridStyles['container']}>
    <div className={gridStyles['small-span']}>
    </div>
    <div className={gridStyles['big-span']}>
    </div>
  </div>
)

CustomFieldsSectionComponent.propTypes = {
  customs: PropTypes.array.isRequired,
  onAdd: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  customs: filterItems(state.customFields.items).map()
})

const mapDispatchToProps = dispatch => ({
  onAdd() {},
  onBack() {},
  onRemove() {},
  onSelect() {}
})

const CustomFieldsSection = connect()(CustomFieldsSectionComponent)

export default CustomFieldsSection



function filterItems(items, route) {
  return Object.values(items).filter(i => i.store === route)
}

function mapCustom(c) {
  return {
    ...c,
    primaryText: c.name,
    secondaryText: c.type,
    avatar: getAvatar(c.type)
  }
}

function getAvatar(type) {
  return type === 'string' 
  ? <Avatar backgroundColor={orange500}>S</Avatar> 
  : <Avatar backgroundColor={blue500}>N</Avatar>
}
