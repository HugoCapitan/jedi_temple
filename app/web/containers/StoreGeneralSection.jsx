import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Avatar from 'material-ui/Avatar'

import MessagesTile from '../components/MessagesTile'
import TableTile from '../components/TableTile'
import Tile from '../components/Tile'

import { 
  changeSection, 
  selectProduct, 
  selectNewProduct, 
  selectOrder, 
  selectTop, 
  selectNewTop, 
  deselectAllTops,
  openDialog,
  closeDialog
} from '../actions'

import TopFormDialog from '../components/TopFormDialog'

import gridStyles from '../styles/grid'

const orderTableColumns = [
  {display: 'Date', field: 'display_date'}, 
  {display: 'Status', field: 'status'}, 
  {display: 'Client Email', field: 'email'}, 
  {display: 'Order Code', field: 'order_code'},
  {display: 'Tracking #', field: 'tracking_code'}
]

const StoreGeneralSectionComponent = ({ dialog, messages, messagesActions, orders, ordersActions, products, productsActions, tops, topsActions }) => (
  <div className={gridStyles['container']}>
    <TableTile
      actions={ordersActions}
      classes={ [gridStyles['big-tile'], gridStyles['left-tile']].join(' ') }
      columns={orderTableColumns}
      items={orders}
      title="Orders"
    />
    <MessagesTile 
      classes={ [gridStyles['small-tile'], gridStyles['right-tile']].join(' ') }  
      messages={messages}
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
    { dialog.dialog === 'topForm' ?
      <TopFormDialog top={dialog.object} open={true} onCancel={topsActions.cancelEdits} onSave={topsActions.save} />
      : ''
    }
  </div>
)

StoreGeneralSectionComponent.propTypes = {
  dialog: PropTypes.object.isRequired,
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
  dialog: getDialog(state),
  messages: filterItems(state.messages.items, state.ui.route),
  orders: filterItems(state.orders.items, state.ui.route).map(mapOrder),
  products: filterItems(state.products.items, state.ui.route).map(mapProduct),
  tops: filterItems(state.tops.items, state.ui.route).map(mapTop)
})

const mapDispatchToProps = dispatch => ({
  messagesActions: {
    select() {}
  },
  ordersActions: {
    select(id) { 
      dispatch(selectOrder(id))
      dispatch(changeSection('orderDetail')) 
    }
  },
  productsActions: {
    add() { 
      dispatch(selectNewProduct()) 
      dispatch(changeSection('productEdit')) 
    },
    config() { dispatch(changeSection('customs')) },
    remove() {},
    select(id) { 
      dispatch(selectProduct(id)) 
      dispatch(changeSection('productEdit')) 
    }
  },
  topsActions: {
    add() {
      dispatch(selectNewTop())
      dispatch(openDialog('topForm'))
    }, 
    remove() {},
    select(id) {
      dispatch(selectTop(id))
      dispatch(openDialog('topForm'))
    },
    cancelEdits() {
      dispatch(deselectAllTops())
      dispatch(closeDialog())
    },
    save() {}
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

function getDialog(state) {
  return state.ui.dialog === 'topForm' 
  ? { dialog: 'topForm', object: state.tops.selected || { text: '' } }
  : { dialog: 'none' }
}

function mapOrder(o) {
  return ({
    ...o,
    display_date: moment(o.created_at).format('MMMM do, YYYY')
  })
}

function mapProduct(p) {
  return ({
    ...p,
    primaryText: p.name, 
    secondaryText: <p>US ${p.price}<br />Stock: {p.stock}</p>,
    avatar: <Avatar src={p.images[0].url} />
  })
}

function mapTop(t) {
  return ({
    ...t,
    primaryText: t.text,
    secondaryText: `${t.time || 'Not Timed'} | Priority: ${t.priority || 'No priority'}`
  })
}

