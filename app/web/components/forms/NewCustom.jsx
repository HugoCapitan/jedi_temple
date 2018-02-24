import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import RadioButton from 'material-ui/RadioButton'
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup'
import TextField from 'material-ui/TextField'

class NewCustom extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...this.props.custom }
  }

  handleChange(event, value) {
    console.log(event.target)
    console.log(value)
  }

  handleCheck() {}

  handleType(value) {
    let options = {}
    if (value === 'string') 
      options = { values: [] }
    else if (value === 'number') 
      options = { min: '', max: '', unit: '', unit_place: '' }
    
    this.setState({
      type: value
    })
  }

  toggleValueDialog() {}

  render() {
    return (
      <div>
        <List>
          <ListItem innerDivStyle={{ paddingTop: '0' }} disabled={true}>
            <TextField 
              floatingLabelText="Name"
              fullWidth={true}
            />
            <SelectField
              floatingLabelText="Type"
              fullWidth={true}
              value={this.state.type}
              onChange={ (e, i, v) => { this.handleType.call(this, v) } }
            >
              <MenuItem value={'string'} primaryText="String" />
              <MenuItem value={'number'} primaryText="Number" />
            </SelectField>
          </ListItem>
          <ListItem 
            primaryText="Show in site" 
            leftCheckbox={<CheckBox checked={this.state.show} name="show" onCheck={this.handleCheck.bind(this)} />} 
          />
          <ListItem 
            primaryText="Allow filter" 
            leftCheckbox={<CheckBox checked={this.state.filter} name="filter" onCheck={this.handleCheck.bind(this)} />} 
          />
          <Divider />
        </List>
        { this.state.type === 'string' 
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
            {/* {this.state.values.map((cValue, index) => (
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
            ))} */}
          </div>
          : 'hi'
        }
      </div>
    )
  }
}

export default NewCustom


NewCustom.propTypes = {

}
