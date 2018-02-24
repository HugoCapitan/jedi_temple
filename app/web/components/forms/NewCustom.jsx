import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider'
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

  handleChange() {}

  handleCheck() {}

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
              onChange={this.handleChange}
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
      </div>
    )
  }
}

export default NewCustom


NewCustom.propTypes = {

}
