import React from 'react'
import PropTypes from 'prop-types'

import CustomFdBaseForm from './CustomFdBaseForm'
import CustomFdNumberForm from './CustomFdNumberForm'
import CustomFdStringForm from './CustomFdStringForm'

class CustomFdForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props.custom }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(propKey, propVal) {
    this.setState({
      [propKey]: propVal
    })
  }

  render() {
    return (
      <div>
        <CustomFdBaseForm 
          name={this.state.name}
          type={this.state.type}
          show={this.state.show}
          filter={this.state.filter}
          reportChange={this.handleChange}
        />
        { this.state.type === 'string' ? 
          <CustomFdStringForm values={this.state.values} reportChange={this.handleChange} /> 
          :
          <CustomFdNumberForm 
            min={this.state.min}
            max={this.state.max}
            unit={this.state.unit}
            unit_place={this.state.unit_place}
            reportChange={this.handleChange}
          /> 
        }
      </div>
    )
  }
}

CustomFdForm.propTypes = {
  custom: PropTypes.object.isRequired,
  isNew: PropTypes.bool
}

export default CustomFdForm
