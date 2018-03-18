import React from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'

import formStyles from '../styles/form'

class TopFormDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props.top }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {

  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.props.onCancel}
      />,
      <FlatButton 
        label="Save"
        primary={true}
        onClick={this.props.onSave}
      />
    ]

    return (
      <Dialog
        title={this.props.top.name.length ? 'Edit Top' : 'New Top'}
        actions={actions}
        modal={true}
      >
        <TextField
          floatingLabelText="Text"
          fullWidth={true}
          name="Text"
          value={this.state.text}
          onChange={this.handleChange}
        />
        <TextField
          className={formStyles['half-input']}
          floatingLabelText="Time"
          name="Text"
          value={this.state.time}
          onChange={this.handleChange}
        />
        <TextField
          className={formStyles['half-input']}
          floatingLabelText="Priority"
          value={this.state.priority}
          name="Text"
          onChange={this.handleChange}
        />
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

