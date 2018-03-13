import React from 'react'
import PropTypes from 'prop-types' 

import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

import formStyles from '../styles/form'

const statuses = [
  'Pending', 'Awaiting Payment', 'Awaiting Fulfillment', 'Awaiting Shipment', 'Awaiting Pickup',
  'Partially Shipped', 'Completed', 'Shipped', 'Cancelled', 'Declined', 'Refunded', 'Disputed',
  'Verification Required', 'Partially Refunded'
]

const OrderDetailGeneral = ({ order, reportChange }) => (
  <div>
    <div className={formStyles['const-field']}>
      <small>Email</small>
      <p>{order.email}</p>
    </div>
    <div className={formStyles['const-field']}>
      <small>Order Code</small>
      <p>{order.order_code}</p>
    </div>
    <TextField
      floatingLabelText="Tracking Number"
      fullWidth={true}
      name="tracking_number"
      onChange={(e) => { reportChange('tracking_number', e.target.value) }}
      value={order.tracking_number}
    />
    <SelectField
      floatingLabelText="Status"
      fullWidth={true}
      name="status"
      onChange={(e, i, v) => { reportChange('status', v) }}
      value={order.status}
    >
      {statuses.map((status, index) => (
        <MenuItem key={index} value={status} primaryText={status} />
      ))}
    </SelectField>
    <div className={formStyles['const-field']}>
      <small>Payment Method</small>
      <p>{order.payment_method}</p>
    </div>
    <div className={formStyles['const-field']}>
      <small>Payment Id</small>
      <p>{order.payment_id}</p>
    </div>
    <div className={formStyles['const-field']}>
      <small>Shipping</small>
      <p>{order.shipping}</p>
    </div>
  </div>
)

OrderDetailGeneral.propTypes = {
  order: PropTypes.object.isRequired,
  reportChange: PropTypes.func.isRequired
}

export default OrderDetailGeneral

