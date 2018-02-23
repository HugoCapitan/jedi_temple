import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import GeneralSection from './GeneralSection'
import CustomsSection from './CustomsSection'

import baseStyles from '../styles/base'

const EStoreComponent = ({ section }) => {
  let displaySection = ''

  if (section === 'general') displaySection = <GeneralSection />
  if (section === 'customs') displaySection = <CustomsSection />

  return (
    <div className={baseStyles['flex-grow']} style={{ position: 'relative' }}>
      { displaySection }
    </div>
  )
}

const mapStateToProps = state => ({
  section: state.ui.section
})

const EStore = connect(
  mapStateToProps
)(EStoreComponent)

export default EStore
