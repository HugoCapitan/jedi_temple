import React from 'react'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'

const CustomFieldDropdown = ({ name, id, cValues, selected, handleChange }) => (
  <SelectField
    floatingLabelText={name}
    fullWidth={true}
    name={id}
    onChange={(event, index, value) => {
      handleChange(event, value, id)
    }}
    value={selected}
  >
    <MenuItem value={undefined} primaryText="" />                    
    {cValues.map((cVal, index) => (
      <MenuItem key={index} value={cVal._id} primaryText={cVal.value} />
    ))}
  </SelectField>
)

export default CustomFieldDropdown
