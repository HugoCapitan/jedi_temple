import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CustomFieldsSection from './CustomFieldsSection'
import StoreGeneralSection from './StoreGeneralSection'

const CurrentSectionComponent = ({ section }) => {
  let displaySection = ''

  if (section === 'general') displaySection = <StoreGeneralSection />
  if (section === 'customs') displaySection = <CustomFieldsSection />

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
