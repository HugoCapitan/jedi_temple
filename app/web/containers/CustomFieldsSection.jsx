import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Avatar from 'material-ui/Avatar'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import ListItem from 'material-ui/List/ListItem'
import {
  blue500,
  orange500
} from 'material-ui/styles/colors'

import CollectionList from '../components/CollectionList'
import TileHeader from '../components/TileHeader'

import gridStyles from '../styles/grid'

const CustomFieldsSectionComponent = ({ customs, onAdd, onBack, onRemove, onSelect }) => (
  <div className={gridStyles['container']}>
    <div className={gridStyles['small-span']}>
      <TileHeader 
        backAction={onBack}
        title="Fields"
      />
      <ListItem 
        onClick={onAdd}
        primaryText="Add a Field"
        leftIcon={<IconContentAddCircle />}
      />
      <CollectionList 
        items={customs}
      />
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
  customs: filterItems(state.customFields.items, state.ui.route).map(mapCustom)
})

const mapDispatchToProps = dispatch => ({
  onAdd() {},
  onBack() {},
  onRemove() {},
  onSelect() {}
})

const CustomFieldsSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomFieldsSectionComponent)

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
