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
        </div>
        <div className={gridStyles['half-column']}>
          <div>
            <h2> Products </h2>
          </div>
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

