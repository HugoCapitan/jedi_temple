import React from 'react'
import PropTypes from 'prop-types'

class OrderDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props.order }
  }

  render() {
    return (
      <div> OrderDetail Component </div>
    )
  }
}

OrderDetail.propTypes = {
  order: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
}

export default OrderDetail

