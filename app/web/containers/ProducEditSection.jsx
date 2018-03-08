import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProductForm from '../components/ProductForm'
import TileHeader from '../components/TileHeader'

import { changeSection } from '../actions'

import gridStyles from '../styles/grid'

const newProductBlueprint = { name: '', stock: '', price: '', description: '', customs: [] }

const ProductEditSectionComponent = ({customs, product, newProduct, goBack, save}) => {
  let form
  if (product) 
    form = <ProductForm product={product} customs={customs} save={save} />
  else if (newProduct)
    form = <ProductForm product={newProductBlueprint} customs={customs} save={save} />

  return (
    <div className={gridStyles['container']}>
      <TileHeader title={ product ? "Edit Product" : "New Product" } backAction={goBack} />
      <div className={gridStyles['container-padded']}>
        { form }
      </div>
    </div>
  )
}

ProductEditSectionComponent.propTypes = {
  customs: PropTypes.array.isRequired,
  product: PropTypes.object,
  newProduct: PropTypes.bool,
  goBack: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  customs: filterItems(state.customFields.items, state.ui.route),
  product: state.products.selected,
  newProduct: state.products.newSelected
})

const mapDispatchToProps = dispatch => ({
  goBack() { dispatch(changeSection('general')) },
  save() {}
})

const ProductEditSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEditSectionComponent)

export default ProductEditSection



function filterItems(items, route) {
  return Object.values(items).filter(i => i.store === route)
}
