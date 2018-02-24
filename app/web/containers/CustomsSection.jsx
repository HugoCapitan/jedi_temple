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
import NewCustom        from '../components/forms/NewCustom'

import {
  changeSection,
  requestCustomAdd,
  requestCustomRemove,
  requestCustomUpdate
} from '../actions'

import dialogStyles from '../styles/dialogs'
import baseStyles from '../styles/base'

class component extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedCustom: undefined, newCustom: undefined }
  }

  componentWillReceiveProps() {
    this.setState({ selectedCustom: undefined })
  }

  handleNewCustom() {
    this.setState({
      selectedCustom: undefined,
      newCustom: { name: '', type: 'string',  }
    })
  }
  
  selectCustom(id) {
    const selectedCustom = this.props.customs.find(cust => cust._id === id)
    if (selectedCustom)
      this.setState({ newCustom: undefined, selectedCustom })
  }

  render() {
    const containerStyle = {
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0'
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

    const addFormActions = [{
      label: 'Save',
      primary: true,
      onClick: this.props.onAddCustom
    }]

    const newCustom = (
      <ListItem 
        onClick={this.handleNewCustom.bind(this)}
        primaryText="Add a Field"
        rightIcon={<IconContentAddCircle />}
      />
    )

    return (
      <div style={containerStyle}>
        <div className={dialogStyles['small-span']} style={ { maxHeight: 'inherit' } }>
          <ListHeader title="Fields" leftIcon={CloseButton} />
          <CollectionList items={this.props.customs} addItem={newCustom} onDelete={this.props.onRemoveCustom} onEdit={this.selectCustom.bind(this)} />
        </div>
        <div className={`${dialogStyles['big-span']} ${dialogStyles['left-border']}`} style={ { height: '100%', display: 'flex', flexDirection: 'column' } }>
          <Toolbar style={{ flexBasis: '56px', height: '56px', minHeight: '56px' }}>
            <ToolbarGroup firstChild={true}>
              <ToolbarTitle 
                text={ !!this.state.selectedCustom 
                  ? `Configure ${this.state.selectedCustom.name} field` 
                  : (
                    !!this.state.newCustom
                    ? 'New Custom Field'
                    : 'Select a field to begin'
                  ) 
                }
              />
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
              
            </ToolbarGroup>
          </Toolbar>
          <div style={{ flexShrink: '1', overflowY: 'scroll' }}>
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
              ):(
              !!this.state.newCustom 
                ? <NewCustom 
                    custom={this.state.newCustom}
                    formActions={addFormActions}
                  />
                : 'Select something'
              )
            }
          </div>          
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
