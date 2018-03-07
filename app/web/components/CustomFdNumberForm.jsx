import React from 'react'
import PropTypes from 'prop-types'

import RadioButton from 'material-ui/RadioButton'
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup'
import TextField from 'material-ui/TextField'

import gridStyles from '../styles/grid'

const CustomFdNumberForm = ({ min, max, unit, unit_place, reportChange }) => (
  <div className={gridStyles['container']}>
    <TextField 
      floatingLabelText="Min Value"
      fullWidth={true}
      name="min"
      value={min}
      onChange={ev => { reportChange('min', ev.target.value) }}
    />
    <TextField 
      floatingLabelText="Max Value"
      fullWidth={true}
      name="max"
      value={max}
      onChange={ev => { reportChange('max', ev.target.value) }}
    />
    <TextField 
      floatingLabelText="Unit (For display porpouses)"
      fullWidth={true}
      name="unit"
      value={unit}
      onChange={ev => { reportChange('unit', ev.target.value) }}
    />
    <p>Unit Placement</p>
    <RadioButtonGroup 
      name="unit_place" 
      defaultSelected="after"
      valueSelected={unit_place}
      onChange={(e, v) => { reportChange('unit_place', v) }}
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
  </div>
)

CustomFdNumberForm.propTypes = {
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  unit_place: PropTypes.string.isRequired,
  reportChange: PropTypes.func.isRequired
}

export default CustomFdNumberForm
