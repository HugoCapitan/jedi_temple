import React from 'react'
import PropTypes from 'prop-types'

class ProductCustomsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return(
      <div></div>
    )
  }
}

ProductCustomsForm.propTypes = {
  customs: PropTypes.array.isRequired,
  reportChange: PropTypes.func.isRequired
}

export default ProductCustomsForm
