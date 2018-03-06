import React from 'react'
import PropTypes from 'prop-types'

import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'

import gridStyles from '../styles/grid'

const CustomFdNumberForm = ({ min, max, unit, unit_place, reportChanges }) => (
  <div className={gridStyles['container']}>
    
  </div>
)

CustomFdNumberForm.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  unit_place: PropTypes.string.isRequired,
  reportChanges: PropTypes.func.isRequired
}

export default CustomFdNumberForm
