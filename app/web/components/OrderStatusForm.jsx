import React from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

const statuses = [
  'Pending', 'Awaiting Payment', 'Awaiting Fulfillment', 'Awaiting Shipment', 'Awaiting Pickup',
  'Partially Shipped', 'Completed', 'Shipped', 'Cancelled', 'Declined', 'Refunded', 'Disputed',
  'Verification Required', 'Partially Refunded'
]

class OrderStatusFormDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { status: this.props.status, tracking_number: this.props.tracking_number || '' }
  }

  handleChange

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={this.props.onCancel}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onClick={() => { this.props.onSave(this.state.status, this.state.tracking_number) }}
      />
    ]

    return (
      <Dialog
        title="Order Status"
        actions={actions}
        modal={true}
        open={this.props.open}
      >
        The dialog
      </Dialog>
    )
  }
}

OrderStatusForm.propTypes = {
  tracking_number: PropTypes.string,
  status: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default OrderStatusForm

