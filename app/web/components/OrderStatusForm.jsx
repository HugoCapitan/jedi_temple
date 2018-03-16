import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

const statuses = [
  'Pending', 'Awaiting Payment', 'Awaiting Fulfillment', 'Awaiting Shipment', 'Awaiting Pickup',
  'Partially Shipped', 'Completed', 'Shipped', 'Cancelled', 'Declined', 'Refunded', 'Disputed',
  'Verification Required', 'Partially Refunded'
]

const trackableStatuses = [
  'Partially Shipped', 'Shipped', 'Awaiting Pickup'
]

class OrderStatusForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { status: this.props.status, tracking: this.props.tracking }

    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleTrackingChange = this.handleTrackingChange.bind(this)
  }

  handleStatusChange(e, i, v) {
    this.setState({
      status: v
    })
  }

  handleTrackingChange(e) {
    this.setState({
      tracking: e.target.value
    })
  }

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
        onClick={() => { this.props.onSave(this.state.status, this.state.tracking) }}
      />
    ]

    return (
      <Dialog
        title="Edit Order"
        actions={actions}
        modal={false}
        open={this.props.open}
        contentStyle={{width: '400px'}}
      >
        <SelectField 
          floatingLabelText="Status"
          fullWidth={true}
          value={this.state.status}
          onChange={this.handleStatusChange}
        >
        {statuses.map((st, i) => 
          <MenuItem key={i} value={st} primaryText={st} />
        )}
        </SelectField>
        { _.includes(trackableStatuses, this.state.status) 
        ? <TextField 
            floatingLabelText="Tracking Number"
            fullWidth={true}
            autoFocus={true}
            value={this.state.trackingNumber}
            onChange={this.handleTrackingChange}
          />
        : '' 
        }
      </Dialog>
    )
  }
} 

OrderStatusForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  trackingNumber: PropTypes.string.isRequired
}

export default OrderStatusForm

