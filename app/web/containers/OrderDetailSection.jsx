import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TileHeader from '../components/TileHeader'
import OrderDetail from '../components/OrderDetail'

import { changeSection } from '../actions'

const OrderDetailSectionComponent = ({ selectedOrder, onBack, onSave }) => (
  <div>
    <TileHeader title="Order Detail" backAction={onBack} />
    <OrderDetail order={selectedOrder} onSave={onSave} />
  </div>
)

OrderDetailSectionComponent.propTypes = {
  selectedOrder: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  selectedOrder: state.orders.selected
})

const mapDispatchToProps = dispatch => ({
  onBack() { dispatch(changeSection('general')) },
  onSave() { }
})

const OrderDetailSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetailSectionComponent)

export default OrderDetailSection

