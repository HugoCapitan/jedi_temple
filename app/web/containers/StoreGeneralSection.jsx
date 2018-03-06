import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Avatar from 'material-ui/Avatar'

import Tile from '../components/Tile'

import gridStyles from '../styles/grid'

const StoreGeneralSectionComponent = ({ messages, messagesActions, orders, ordersActions, products, productsActions, tops, topsActions }) => (
  <div className={gridStyles['container']}>
    <Tile
      actions={ordersActions}
      classes={ [gridStyles['big-tile'], gridStyles['left-tile']].join(' ') }
      items={orders}
      title="Orders"
    />
    <Tile 
      actions={messagesActions}
      classes={ [gridStyles['small-tile'], gridStyles['right-tile']].join(' ') }
      items={messages}
      title="Messages"
    />
    <Tile 
      actions={productsActions}
      classes={ [gridStyles['half-tile'], gridStyles['left-tile']].join(' ') }
      items={products}
      title="Products"
    />
    <Tile 
      actions={topsActions}
      classes={ [gridStyles['half-tile'], gridStyles['right-tile']].join(' ') }
      items={tops}
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
  products: filterItems(state.products.items, state.ui.route).map(mapProduct),
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
    config() {},
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

function filterItems(items, route) {
  return Object.values(items).filter(i => i.store === route)
}

function mapProduct(p) {
  return ({
    ...p,
    primaryText: p.name, 
    secondaryText: <p>US ${p.price}<br />Stock: {p.stock}</p>,
    avatar: <Avatar src={p.images[0].url} />
  })
}