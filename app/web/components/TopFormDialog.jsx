import React from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'

class TopFormDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props.top }
  }

  render() {
    return (
      <Dialog>
      </Dialog>
    )
  }
}

TopFormDialog.propTypes = {
  top: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default TopFormDialog

