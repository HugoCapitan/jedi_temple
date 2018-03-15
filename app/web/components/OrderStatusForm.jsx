import React from 'react'
import PropTypes from 'prop-types'

class OrderStatusFormDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { status: this.props.status, tracking_number: this.props.tracking_number || '' }
  }

  render() {
    <div>
    </div>
  }
}

OrderStatusForm.propTypes = {
  status: PropTypes.string.isRequired,
  tracking_number: PropTypes.string
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default OrderStatusForm

