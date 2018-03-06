import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from 'material-ui/Checkbox'
import ListItem from 'material-ui/List/ListItem'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

import gridStyles from '../styles/grid'

const CustomFdBaseForm = ({ isTypeEditable, name, type, show, filter, reportChange }) => (
  <div className={gridStyles['container']}>
    <TextField 
      floatingLabelText="Name"
      fullWidth={true}
      name="name"
      value={name}
      onChange={ev => { reportChange('name', ev.target.value) }}
    />
    { isTypeEditable ? 
      <SelectField
        floatingLabelText="Type"
        fullWidth={true}
        value={this.state.custom.type}
        onChange={(e, i, v) => { reportChange('type', v) }}
      >
        <MenuItem value={'string'} primaryText="String" />
        <MenuItem value={'number'} primaryText="Number" />
      </SelectField> :
      <ListItem 
        disabled={true}
        primaryText={type}
      />
    }
    <Checkbox
      label="Show In Site"
      checked={show}
      onCheck={() => { reportChange('show', !show) }}
    />
    <Checkbox
      label="Allow Filter"
      checked={filter}
      onCheck={() => { reportChange('filter', !filter) }}
    />
  </div>
)

CustomFdBaseForm.propTypes = {
  isTypeEditable: PropTypes.bool,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  filter: PropTypes.bool.isRequired,
  reportChange: PropTypes.func.isRequired
}

export default CustomFdBaseForm
