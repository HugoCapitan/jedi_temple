import React from 'react'
import PropTypes from 'prop-types'

class CustomFdStringForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { openInput: false, inputVal: '' }
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}

CustomFdStringForm.propTypes = {
  values: PropTypes.array.isRequired,
  reportChange: PropTypes.func.isRequired
}

export default CustomFdStringForm
