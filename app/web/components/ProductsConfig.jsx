import React from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import IconNavigationClose from 'material-ui/svg-icons/navigation/close'
import Toolbar from 'material-ui/Toolbar/Toolbar'
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup'
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle'

import ListHeader from './ListHeader'
import CollectionList from './CollectionList'
import CustomFieldEdit from './CustomFieldEdit'

import dialogStyles from '../styles/dialogs'

class ProductsConfig extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedCustom: undefined
    }
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
          { !!this.state.selectedCustom 
            ? <CustomFieldEdit custom={this.state.selectedCustom} />
            : <p>No field selected</p>
          }
        </div>
  
      </Dialog>
    )
  }
}

ProductsConfig.propTypes = {
  customs: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default ProductsConfig
