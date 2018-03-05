import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import ProductsTile from '../components/ProductsTile'
import Tile from '../components/Tile'

const StoreGeneralSectionComponent = ({ messages, messagesActions, orders, ordersActions, products, productsActions, tops, topsActions }) => (
  <div>
    <Tile 
      actions={ordersActions}
      items={orders}
      size="big"
      title="Orders"
    />
    <Tile 
      actions={messagesActions}
      items={messages}
      size="small"
      title="Messages"
    />
    <Tile 
      actions={productsActions}
      items={products}
      size="half"
      title="Products"
    />
    <Tile 
      actions={topsActions}
      items={tops}
      size="half"
      title="Tops"
    />
  </div>
)

StoreGeneralSectionComponent.propTypes = {
  messages: PropTypes.array.isRequired,
  messagesActions: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired,
  ordersActions: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  productsActions: PropTypes.object.isRequired,
  tops: PropTypes.array.isRequired,
  topsActions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  messages: [],
  orders: [],
  products: [],
  tops: []
})

const mapDispatchToProps = dispatch => ({
  messagesActions: {
    select() {}
  },
  ordersActions: {
    select() {}
  },
  productsActions: {
    add() {},
    remove() {},
    select() {}
  },
  topsActions: {
    add() {}, 
    remove() {},
    select() {}
  }
})

const StoreGeneralSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoreGeneralSectionComponent)

export default StoreGeneralSection
