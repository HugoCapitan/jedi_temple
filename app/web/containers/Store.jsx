import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import ProductsSection from './ProductsSection'

const EStoreComponent = ({ route }) => (
  <div>
    <ProductsSection />
  </div>
)

const mapStateToProps = state => ({
  route: state.ui.route
})

const EStore = connect(
  mapStateToProps
)(EStoreComponent)

export default EStore
