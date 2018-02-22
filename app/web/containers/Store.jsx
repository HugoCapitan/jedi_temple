import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import GeneralSection from './GeneralSection'

const EStoreComponent = ({ section }) => {
  let displaySection = ''

  if (section === 'general') displaySection = <GeneralSection />

  return (
    <div>
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
