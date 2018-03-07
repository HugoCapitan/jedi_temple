import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CustomFieldsSection from './CustomFieldsSection'
import ProductEditSection from './ProducEditSection'
import StoreGeneralSection from './StoreGeneralSection'

const CurrentSectionComponent = ({ section }) => {
  let displaySection = ''

  if (section === 'customs') displaySection = <CustomFieldsSection />
  if (section === 'productEdit') displaySection = <ProductEditSection />
  if (section === 'general') displaySection = <StoreGeneralSection />

  return displaySection
}

CurrentSectionComponent.propTypes = {
  section: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  section: state.ui.section
})

const CurrentSection = connect(
  mapStateToProps
)(CurrentSectionComponent)

export default CurrentSection
