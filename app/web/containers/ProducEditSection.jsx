import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProductForm from '../components/ProductForm'
import TileHeader from '../components/TileHeader'

import ProductForm from '../components/ProductForm'

import { changeSection } from '../actions'

import gridStyles from '../styles/grid'

const ProductEditSectionComponent = ({customs, product, newProduct, goBack}) => (
  <div>

  </div>
)

ProductEditSectionComponent.propTypes = {
  customs: PropTypes.array.isRequired,
  product: PropTypes.object,
  newProduct: PropTypes.object,
  goBack: PropTypes.func.isRequired
}

const newProductBlueprint = { name: '', stock: '', price: '', description: '', customs: [] }

const mapStateToProps = state => ({
  customs: filterItems(state.customFields.items),
  product: state.products.selected ? <ProductForm product={state.products.selected} /> : undefined,
  newProduct: state.products.newSelected ? <ProductForm product={newProductBlueprint} /> : undefined
})

const mapDispatchToProps = dispatch => ({
  goBack() {}
})

const ProductEditSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEditSectionComponent)

export default ProductEditSection


