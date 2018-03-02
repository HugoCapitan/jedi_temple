import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'
import MenuItem from 'material-ui/MenuItem'
import RadioButton from 'material-ui/RadioButton'
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

import SimpleInputDialog from '../SimpleInputDialog'

class NewCustom extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      custom: {
        name: '', type: 'string', show: false, filter: false,  values: [], min: 'auto', max: 'auto', unit: '', unit_place: 'before'
      }, 
      valueDialog: { open: false, text: '' } 
    }
  }

  handleAddValue(value) {
    const exists = this.state.custom.values.find(cVal => cVal.value === value)

    if (!exists)
      this.setState({
        custom: { ...this.state.custom,
          values: [ { value }, ...this.state.custom.values ]
        }
      })

    this.setState({ valueDialog: { open: false, text: '' } })
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

  handleCheck(event, isChecked) {
    this.setState({ custom: { 
      ...this.state.custom, 
      [event.target.name]: isChecked 
    } })
  }

  handlePlaceChange(event, value) {
    this.setState({
      custom: {
        ...this.state.custom,
        unit_place: value
      }
    })
  }

  handleRemoveValue(value) {
    this.setState({ 
      custom: { ...this.state.custom,
        values: this.state.custom.values.filter(cVal => cVal.value != value)
      } 
    })
  }

  handleType(value) {
    this.setState({
      custom: {
        ...this.state.custom,
        type: value
      }
    })
  }

  toggleValueDialog() {
    this.setState({ valueDialog: {
      open: !this.state.valueDialog.open,
      text: ''
    } })
  }

  render() {
    return (
      <div>
        <List>
          <ListItem innerDivStyle={{ paddingTop: '0' }} disabled={true}>
            <TextField 
              floatingLabelText="Name"
              fullWidth={true}
              name="name"
              value={this.state.custom.name}
              onChange={this.handleChange.bind(this)}
            />
            <SelectField
              floatingLabelText="Type"
              fullWidth={true}
              value={this.state.custom.type}
              onChange={ (e, i, v) => { this.handleType.call(this, v) } }
            >
              <MenuItem value={'string'} primaryText="String" />
              <MenuItem value={'number'} primaryText="Number" />
            </SelectField>
          </ListItem>
          <ListItem 
            primaryText="Show in site" 
            leftCheckbox={<CheckBox checked={this.state.custom.show} name="show" onCheck={this.handleCheck.bind(this)} />} 
          />
          <ListItem 
            primaryText="Allow filter" 
            leftCheckbox={<CheckBox checked={this.state.custom.filter} name="filter" onCheck={this.handleCheck.bind(this)} />} 
          />
          <Divider />
        </List>
        { this.state.custom.type === 'string' 
          ? 
          <div>
            <ListItem
              disabled={true}
              primaryText="Values:"
              initiallyOpen={true}
              rightIconButton={(
                <IconButton onClick={this.toggleValueDialog.bind(this)}>
                  <IconContentAddCircle />
                </IconButton>
              )}
            /> 
            <Divider inset={true} />
            {this.state.custom.values.map((cValue, index) => (
              <ListItem 
                key={index}
                primaryText={cValue.value}
                insetChildren={true}
                rightIconButton={
                  <IconButton onClick={() => { this.handleRemoveValue.call(this, cValue.value) } }>
                    <IconContentRemoveCircle />
                  </IconButton>
                }
            />
            ))}
          </div>
          : 
          <ListItem disabled={true} innerDivStyle={{ paddingTop: '0' }}>
            <TextField 
              floatingLabelText="Min Value"
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
                value="before"
                label="Before Value"
              />
              <RadioButton
                value="after"
                label="After Value"
              />
            </RadioButtonGroup>
          </ListItem>
        }

        <ListItem disabled={true} style={{ textAlign: 'right', padding: '16px 10px 5px 16px' }}>
          <FlatButton
            label="Save"
            onClick={() => { this.props.onSave(this.state.custom) } }
            primary={true}
          />
        </ListItem>

        <SimpleInputDialog 
          open={this.state.valueDialog.open}
          title="New Value"
          onDone={this.handleAddValue.bind(this)}
          onCancel={this.toggleValueDialog.bind(this)}
        />
      </div>
    )
  }
}

export default NewCustom


NewCustom.propTypes = {

}
