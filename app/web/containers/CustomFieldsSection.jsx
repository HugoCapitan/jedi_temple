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
import CustomFdForm from '../components/CustomFdForm'
import TileHeader from '../components/TileHeader'

import { selectCustom, selectNewCustom, changeSection } from '../actions'

import gridStyles from '../styles/grid'

const CustomFieldsSectionComponent = ({ customs, selected, newSelected, onAdd, onBack, onRemove, onSelect }) => (
  <div className={gridStyles['container']}>
    <TileHeader 
      backAction={onBack}
      title="Fields"
    />
    <div className={gridStyles['small-span']}>
      <ListItem 
        onClick={onAdd}
        primaryText="Add a Field"
        leftIcon={<IconContentAddCircle />}
      />
      <CollectionList 
        items={customs}
        onSelect={onSelect}
      />
    </div>
    <div className={gridStyles['big-span']}>
      <div className={gridStyles['container-padded']}>
        { selected }
        { newSelected }
      </div>
    </div>
  </div>
)

CustomFieldsSectionComponent.propTypes = {
  customs: PropTypes.array.isRequired,
  selected: PropTypes.object,
  newSelected: PropTypes.object,
  onAdd: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  customs: filterItems(state.customFields.items, state.ui.route).map(mapCustom),
  selected: state.customFields.selected ? <CustomFdForm custom={state.customFields.selected} /> : undefined,
  newSelected: state.customFields.newSelected ? <CustomFdForm isNew={true} /> : undefined
})

const mapDispatchToProps = dispatch => ({
  onAdd() { dispatch(selectNewCustom()) },
  onBack() { dispatch(changeSection('general')) },
  onRemove() {},
  onSelect(cid) { dispatch(selectCustom(cid)) }
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
