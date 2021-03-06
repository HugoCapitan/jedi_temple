import React from 'react'
import PropTypes from 'prop-types'

import { Tabs, Tab } from 'material-ui/Tabs'

import OrderDetailAddress from './OrderDetailAddress'
import OrderDetailGeneral from './OrderDetailGeneral'
import OrderDetailProducts from './OrderDetailProducts'
import OrderStatusForm from './OrderStatusForm'

import gridStyles from '../styles/grid'

class OrderDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = { first_tab: 'general', second_tab: 'shipping', order: props.order, status_dialog: false }

    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleClose() {
    this.setState({
      status_dialog: false
    })
  }

  handleOpen() {
    this.setState({
      status_dialog: true
    })
  }

  handleTabChange(tab, value) {
    this.setState({
      [tab]: value
    })
  }

  render() {
    return (
      <div className={gridStyles['container']}> 
        <div className={gridStyles['half-span']}>
          <Tabs
            value={this.state.first_tab}
            onChange={(val) => { this.handleTabChange('first_tab', val) }}
          >
            <Tab label="General Info" value="general">
              <div className={gridStyles['container-padded']}>
                <OrderDetailGeneral order={this.state.order} openEditDialog={this.handleOpen} />
              </div>
            </Tab>
            <Tab label="Ordered Products" value="products">
              <div className={gridStyles['container-padded']}>
                <OrderDetailProducts products={this.state.order.products} />
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className={gridStyles['half-span']}>
          <Tabs
            value={this.state.second_tab}
            onChange={(val) => { this.handleTabChange('second_tab', val) }}
          >
            <Tab label="Shipping Address" value="shipping">
              <div className={gridStyles['container-padded']}>
                <OrderDetailAddress address={this.state.order.shipping_address} />
              </div>
            </Tab>
            <Tab label="Billing Address" value="billing">
              <div className={gridStyles['container-padded']}>
                <OrderDetailAddress address={this.state.order.billing_address} />
              </div>
            </Tab>
          </Tabs>
        </div>
        { this.state.status_dialog 
        ? <OrderStatusForm 
            onCancel={this.handleClose}
            onSave={(st, tn) => { this.props.onSave(this.props.order._id, st, tn); this.handleClose() }}
            open={true}
            reportChange={this.handleChange}
            status={this.state.order.status}
            trackingNumber={this.state.order.tracking_number}
          />
        : ''
        }
      </div>
    )
  }
}

OrderDetail.propTypes = {
  order: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default OrderDetail

