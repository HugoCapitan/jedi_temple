import React       from 'react'
import PropTypes   from 'prop-types'
import { connect } from 'react-redux'

import Avatar               from 'material-ui/Avatar'
import Dialog               from 'material-ui/Dialog'
import IconButton           from 'material-ui/IconButton'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconNavigationBack   from 'material-ui/svg-icons/navigation/arrow-back'
import ListItem             from 'material-ui/List/ListItem'
import Toolbar              from 'material-ui/Toolbar/Toolbar'
import ToolbarGroup         from 'material-ui/Toolbar/ToolbarGroup'
import ToolbarTitle         from 'material-ui/Toolbar/ToolbarTitle'
import {
  blue500,
  orange500
} from 'material-ui/styles/colors'

import CollectionList   from '../components/CollectionList'
import CustomStringEdit from '../components/forms/CustomStringEdit'
import CustomNumberEdit from '../components/forms/CustomNumberEdit'
import ListHeader       from '../components/ListHeader'

import {
  changeSection,
  requestCustomAdd,
  requestCustomRemove,
  requestCustomUpdate
} from '../actions'

import dialogStyles from '../styles/dialogs'

class component extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedCustom: undefined }
  }

  componentWillReceiveProps() {
    this.setState({ selectedCustom: undefined })
  }
  
  selectCustom(id) {
    const selectedCustom = this.props.customs.find(cust => cust._id === id)
    if (selectedCustom)
      this.setState({ ...this.state, selectedCustom })
  }

  render() {
    const customContentStyle = {
      width: '100%',
      maxWidth: 'none',
      top: '50%',
      position: 'absolute',
      transform: 'translate(0, -50%)'
    }

    const CloseButton = (
      <IconButton onClick={this.props.onClose}>
        <IconNavigationBack />
      </IconButton>
    )

    const editFormActions = [{
      label: 'Save',
      primary: true,
      onClick: this.props.onUpdateCustom
    }]

    const newCustom = (
      <ListItem 
        onClick={this.handleNewCustom}
        primaryText="Add a Field"
        rightIcon={<IconContentAddCircle />}
      />
    )

    return (
      <div>
        <div className={dialogStyles['small-span']} style={ { maxHeight: 'inherit' } }>
          <ListHeader title="Fields" leftIcon={CloseButton} />
          <CollectionList items={this.props.customs} addItem={newCustom} onDelete={this.props.onDelete} onEdit={this.selectCustom.bind(this)} />
        </div>
        <div className={dialogStyles['big-span']} style={ { maxHeight: 'inherit' } }>
          <Toolbar style={{ flexBasis: '56px' }}>
            <ToolbarGroup firstChild={true}>
              <ToolbarTitle 
                text={ !!this.state.selectedCustom ? `Configure ${this.state.selectedCustom.name} field` : 'Select a field to begin' }
              />
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
              
            </ToolbarGroup>
          </Toolbar>
          {!!this.state.selectedCustom ?  
            (this.state.selectedCustom.type === 'string'
              ? <CustomStringEdit 
                  custom={this.state.selectedCustom}
                  formActions={editFormActions}
                />
              : <CustomNumberEdit 
                  custom={this.state.selectedCustom}
                  formActions={editFormActions}
                />
            ) : 'Select a field'
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  customs: getCustoms(state.customFields.items, state.ui.route)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClose() { dispatch(changeSection('general')) },
  onUpdateCustom(newCustom, oldCustom) { dispatch(requestCustomUpdate(newCustom, oldCustom)) },
  onRemoveCustom(id) { dispatch(requestCustomRemove(id)) },
  onAddCustom(newCustom) { dispatch(requestCustomAdd(newCustom)) }
})

const CustomSettingsDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default CustomSettingsDialog


component.propTypes = {
  customs:        PropTypes.array.isRequired,
  onClose:        PropTypes.func.isRequired,
  onUpdateCustom: PropTypes.func.isRequired,
  onAddCustom:    PropTypes.func.isRequired,
  onRemoveCustom: PropTypes.func.isRequired
}


function getCustoms (items, route) {
  return Object.values(items)
    .filter(it => it.store === route)
    .map(it => ({ ...it, primaryText: it.name, avatar: getAvatar(it.type) }))
}

function getAvatar(type) {
  return type === 'string' ? <Avatar backgroundColor={orange500}>S</Avatar> : <Avatar backgroundColor={blue500}>N</Avatar>
}