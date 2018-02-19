import React       from 'react'
import PropTypes   from 'prop-types'
import { connect } from 'react-redux'

import Avatar              from 'material-ui/Avatar'
import Dialog              from 'material-ui/Dialog'
import IconButton          from 'material-ui/IconButton'
import IconNavigationClose from 'material-ui/svg-icons/navigation/close'
import Toolbar             from 'material-ui/Toolbar/Toolbar'
import ToolbarGroup        from 'material-ui/Toolbar/ToolbarGroup'
import ToolbarTitle        from 'material-ui/Toolbar/ToolbarTitle'
import {
  blue500,
  orange500
} from 'material-ui/styles/colors'

import CollectionList   from '../../components/CollectionList'
import CustomStringEdit from '../../components/forms/CustomStringEdit'
import CustomNumberEdit from '../../components/forms/CustomNumberEdit'
import ListHeader       from '../../components/ListHeader'

import dialogStyles from '../../styles/dialogs'

class component extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedCustom: undefined }
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
      <IconButton>
        <IconNavigationClose />
      </IconButton>
    )

    return (
      <Dialog
        autoDetectWindowHeight={false}
        bodyStyle={ {maxHeight: '95%', padding: '0px'} }
        contentStyle={customContentStyle}
        modal={true}
        open={true}
        titleClassName="hidden"
      >
        <div className={dialogStyles['small-span']}>
          <ListHeader title="Fields" />
          <CollectionList items={this.props.customs} onDelete={this.props.onDelete} onEdit={this.selectCustom.bind(this)} />
        </div>
        <div className={dialogStyles['big-span']}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle 
                text={ !!this.state.selectedCustom ? `Configure ${this.state.selectedCustom.name} field` : 'Select a field to begin' }
              />
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
              {CloseButton}
            </ToolbarGroup>
          </Toolbar>
          {!!this.state.selectedCustom ?  
            (this.state.selectedCustom.type === 'string'
              ? <CustomStringEdit />
              : <CustomNumberEdit />
            ) : 'Select a field'
          }
        </div>
      </Dialog>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  customs: getCustoms(state.customFields.items, state.ui.route)
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

const CustomSettingsDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default CustomSettingsDialog


// CustomSettingsDialog.propTypes = {
//   customs: PropTypes.array.isRequired,
//   onEdit: PropTypes.func.isRequired,
//   onAdd: PropTypes.func.isRequired,
//   onDone: PropTypes.func.isRequired,
//   onRemove: PropTypes.func.isRequired
// }


function getCustoms (items, route) {
  return Object.values(items)
    .filter(it => it.store === route)
    .map(it => ({ ...it, primaryText: it.name, avatar: getAvatar(it.type) }))
}

function getAvatar(type) {
  return type === 'string' ? <Avatar backgroundColor={orange500}>S</Avatar> : <Avatar backgroundColor={blue500}>N</Avatar>
}
