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

const OrderStatusFormDialog = ({onCancel, onSave, open, reportChange, status, trackingNumber}) =>  {
  const actions = [
    <FlatButton
      label="Cancel"
      primary={false}
      onClick={onCancel}
    />,
    <FlatButton
      label="Save"
      primary={true}
      onClick={onSave}
    />
  ]

  return (
    <Dialog
      title="Order Status"
      actions={actions}
      modal={false}
      open={open}
    >
      <SelectField 
        floatingLabelText="Status"
        value={status}
        onChange={(e, i, v) => { reportChange('status', v) }}
      >
      {statuses.map((st, i) => 
        <MenuItem key={i} value={st} primaryText={st} />
      )}
      </SelectField>
    </Dialog>
  )
}

OrderStatusForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  reportChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  trackingNumber: PropTypes.string.isRequired
}

export default OrderStatusForm

