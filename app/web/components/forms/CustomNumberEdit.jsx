import React from 'react'
import PropTypes from 'prop-types'

import CheckBox                from 'material-ui/Checkbox'
import Divider                 from 'material-ui/Divider'
import FlatButton              from 'material-ui/FlatButton'
import IconButton              from 'material-ui/IconButton'
import IconContentAddCircle    from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import List                    from 'material-ui/List/List'
import ListItem                from 'material-ui/List/ListItem'
import RadioButton             from 'material-ui/RadioButton'
import RadioButtonGroup        from 'material-ui/RadioButton/RadioButtonGroup'
import TextField               from 'material-ui/TextField'

import SimpleInputDialog from '../SimpleInputDialog'

import dialogStyles from '../../styles/dialogs'

class CustomNumberEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = { custom: this.props.custom }
  }

  handleCheck(event, isChecked) {
    this.setState({ custom: { 
      ...this.state.custom, 
      [event.target.name]: isChecked 
    } })
  }

  toggleValueDialog() {
    this.setState({ valueDialog: {
      open: !this.state.valueDialog.open,
      text: ''
    } })
  }

  render() {
    return (
      <div className={dialogStyles['left-border']} style={ { overflowY: 'scroll', marginBottom: '52px' } }>
        <List>
          <ListItem disabled={true} primaryText="Field Type: String"/>
          <ListItem 
            primaryText="Show in site" 
            leftCheckbox={<CheckBox checked={this.state.custom.show} name="show" onCheck={this.handleCheck.bind(this)} />} 
          />
          <ListItem 
            primaryText="Allow filter" 
            leftCheckbox={<CheckBox checked={this.state.custom.filter} name="filter" onCheck={this.handleCheck.bind(this)} />} 
          />
          <Divider />
          <ListItem disabled={true} innerDivStyle={{ paddingTop: '0' }}>
            <TextField 
              floatingLabelText="Min Value (Leave blank for auto)"
              fullWidth={true}
              value={this.state.custom.min != 'auto' ? this.state.custom.min : undefined} 
            />
            <TextField 
              floatingLabelText="Max Value" 
              fullWidth={true}
              value={this.state.custom.max != 'auto' ? this.state.custom.max : undefined} 
            />
            <TextField 
              floatingLabelText="Unit (For display porpouses)" 
              fullWidth={true}
              value={this.state.custom.unit} 
            />
            <p>Unit Position</p>        
            <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
              <RadioButton
                value="light"
                label="Right"
              />
              <RadioButton
                value="not_light"
                label="Left"
              />
            </RadioButtonGroup>
          </ListItem>
        </List>

        <div className={dialogStyles['bottom-buttons']}>
          {this.props.formActions.map((action, index) => 
            <FlatButton
              label={action.label}
              onClick={() => { action.onClick(this.state.custom) } }
              primary={action.primary}
              style={{ float: 'right',  margin: '0 10px 5px 0' }}
            />
          )}
        </div>
      </div>
    )
  }
}

export default CustomNumberEdit

CustomNumberEdit.propTypes = {
  custom: PropTypes.object.isRequired,
  formActions: PropTypes.arrayOf(
    PropTypes.objectOf({
      label:   PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      primary: PropTypes.bool
    })
  ).isRequired
}
