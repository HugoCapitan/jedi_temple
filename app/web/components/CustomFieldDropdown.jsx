import React from 'react'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'

const CustomFieldDropdown = ({ custom, selected, handleChange }) => (
  <SelectField
    floatingLabelText={custom.name}
    fullWidth={true}
    name={custom._id}
    onChange={(event, index, value) => {
      handleChange(event, value, custom._id)
    }}
    value={selected}
  >
    <MenuItem value={undefined} primaryText="" />                    
    {custom.values.map((cVal, index) => (
      <MenuItem key={index} value={cVal._id} primaryText={cVal.value} />
    ))}
  </SelectField>
)

export default CustomFieldDropdown
