import React from 'react'
import PropTypes from 'prop-types'

class ProductForm extends React.Component {
  constructor(props) {
    super(props)
    this.sate = { ...props.product }
  }

  render() {
    return (
      <div></div>
    )
  }
}

ProductForm.propTypes = {
  product: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired
}

export default ProductForm
