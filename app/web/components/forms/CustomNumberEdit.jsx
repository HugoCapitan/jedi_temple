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

  handleChange(event) {
    const name = event.target.name
    let value = event.target.value
    if ((name === 'max' || name === 'min') && value != '0' && !+value)
      value = 'auto'

    this.setState({
      custom: {
        ...this.state.custom,
        [name]: value
      }
    })
  }

  handlePlaceChange(event, value) {
    this.setState({
      custom: {
        ...this.state.custom,
        unit_place: value
      }
    })
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
      <div className={dialogStyles['left-border']} style={ { overflowY: 'scroll' } }>
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
              name="min"
              value={this.state.custom.min != 'auto' ? this.state.custom.min : ''} 
              onChange={this.handleChange.bind(this)}
            />
            <TextField 
              floatingLabelText="Max Value" 
              fullWidth={true}
              name="max"
              onChange={this.handleChange.bind(this)}
              value={this.state.custom.max != 'auto' ? this.state.custom.max : ''} 
            />
            <TextField 
              floatingLabelText="Unit (For display porpouses)" 
              fullWidth={true}
              name="unit"
              onChange={this.handleChange.bind(this)}
              required={true}
              value={this.state.custom.unit} 
            />
            <p>Unit Position:</p>        
            <RadioButtonGroup 
              name="unit_place" 
              defaultSelected="after"
              valueSelected={this.state.custom.unit_place}
              onChange={this.handlePlaceChange.bind(this)}
            >
              <RadioButton
                value="after"
                label="After Value"
              />
              <RadioButton
                value="before"
                label="Before Value"
              />
            </RadioButtonGroup>
          </ListItem>
          <ListItem disabled={true} style={{ textAlign: 'right', padding: '16px 10px 5px 16px' }}>
            {this.props.formActions.map((action, index) => 
              <FlatButton
                key={index}
                label={action.label}
                onClick={() => { action.onClick(this.state.custom) } }
                primary={action.primary}
              />
            )}
          </ListItem>
        </List>
      </div>
    )
  }
}

export default CustomNumberEdit

CustomNumberEdit.propTypes = {
  custom: PropTypes.object.isRequired,
  formActions: PropTypes.array.isRequired
}
