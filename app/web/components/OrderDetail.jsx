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

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleChange(key, value) {
    this.setState({
      [key]: value
    })
  }

  handleClose() {
    this.setState({
      status_dialog: true
    })
  }

  handleOpen() {
    this.setState({
      status_dialog: false
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
                <OrderDetailGeneral order={this.state.order} />
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
            tracking_number={this.state.order.tracking_number} 
            status={this.state.order.status}
            onSave={(s, t) => { this.props.onSave(s, t); this.handleClose() }}
            onCancel={this.handleClose}
            reportChange={this.handleChange}
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
  onEditStatus: PropTypes.func.isRequired
}

export default OrderDetail

