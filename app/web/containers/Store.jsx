import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Component = ({ section }) => {
  let displaySection = ''

  if (section === 'general') displaySection = <GeneralSection />
  if (section === 'customs') displaySection = <CustomsSection />

  return (
    <div className={baseStyles['flex-grow']} style={{ position: 'relative' }}>
      { displaySection }
    </div>
  )
}

Component.propTypes = {
  section: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  section: state.ui.section
})

const Store = connect(
  mapStateToProps
)(Component)

export default Store
