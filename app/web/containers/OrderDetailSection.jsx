import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import OrderDetail from '../components/OrderDetail'

const OrderDetailSectionComponent = ({ selectedOrder, onSave }) => (
  <div>

  </div>
)

OrderDetailSectionComponent.propTypes = {
  selectedOrder: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  selectedOrder: state.orders.selected
})

const mapDispatchToProps = dispatch ({
  onSave() { }
})

const OrderDetailSection

