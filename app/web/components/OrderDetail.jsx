import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

import gridStyles from '../styles/grid'
import formStyles from '../styles/form'

const statuses = [
  'Pending', 'Awaiting Payment', 'Awaiting Fulfillment', 'Awaiting Shipment', 'Awaiting Pickup',
  'Partially Shipped', 'Completed', 'Shipped', 'Cancelled', 'Declined', 'Refunded', 'Disputed',
  'Verification Required', 'Partially Refunded'
]

class OrderDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props.order }

    this.handleTrackingChange = this.handleTrackingChange.bind(this)
    this.handleStatusChange   = this.handleStatusChange.bind(this)
  }

  handleTrackingChange(event) {
    this.setState({
      tracking_code: event.target.name
    })
  }

  handleStatusChange(value) {
    this.setState({
      status: value
    })
  }

  render() {
    return (
      <div className={gridStyles['container-padded__full']}> 
        <div className={gridStyles['half-column']}>
          <div className={formStyles['const-field']}>
            <small>Email:</small>
            <p>{this.props.order.email}</p>
          </div>
          <div className={formStyles['const-field']}>
            <small>Order Code:</small>
            <p>{this.props.order.order_code}</p>
          </div>
          <TextField
            floatingLabelText="Tracking Number"
            fullWidth={true}
            name="tracking_number"
            onChange={this.handleTrackingChange}
            value={this.state.tracking_number}
          />
          <div className={formStyles['const-field']}>
            <small>Order Code:</small>
            <p>{this.props.order.order_code}</p>
          </div>
          <div className={formStyles['const-field']}>
            <small>Order Code:</small>
            <p>{this.props.order.order_code}</p>
          </div>
        </div>
        <div className={gridStyles['half-column']}>
          <SelectField
            floatingLabelText="Status"
            fullWidth={true}
            name="status"
            onChange={(e, i, v) => { this.handleStatusChange(v) }}
            value={this.state.status}
          >
            {statuses.map((status, index) => (
              <MenuItem key={index} value={status} primaryText={status} />
            ))}
          </SelectField>
        </div>
      </div>
    )
  }
}

OrderDetail.propTypes = {
  order: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
}

export default OrderDetail

