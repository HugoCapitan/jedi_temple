import React from 'react'
import PropTypes from 'prop-types'

import CustomFdBaseForm from './CustomFdBaseForm'
import CustomFdNumberForm from './CustomFdNumberForm'
import CustomFdStringForm from './CustomFdStringForm'

const newCustomBlueprint = { 
  name: '', 
  type: 'string', 
  show: false, 
  filter: false, 
  values: [],
  min: 'auto',
  max: 'auto',
  unit: '',
  unit_place: 'before'
}

class CustomFdForm extends React.Component {
  constructor(props) {
    super(props)
    
    if (props.isNew)
      this.state = { ...newCustomBlueprint }
    else
      this.state = { ...props.custom }

    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isNew)
      this.setState({ ...newCustomBlueprint })
    else
      this.setState({ ...nextProps.custom })
  }

  handleChange(propKey, propVal) {
    if ((propKey === 'max' || propKey === 'min') && propVal != '0' && !+propVal) 
      propVal = 'auto'

    this.setState({
      [propKey]: propVal
    })
  }

  render() {
    return (
      <div>
        <CustomFdBaseForm 
          isTypeEditable={this.props.isNew}
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
  custom: PropTypes.object,
  isNew: PropTypes.bool
}

export default CustomFdForm
