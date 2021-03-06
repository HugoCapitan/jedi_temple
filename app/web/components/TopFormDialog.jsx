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
    const key = event.target.name
    let value = event.target.value

    console.log(key)

    if (key === 'time' && value != 0 && !+value)
      value = undefined

    this.setState({
      [key]: value
    })
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
        title={this.props.top.text.length ? 'Edit Top' : 'New Top'}
        actions={actions}
        open={this.props.open}
        modal={true}
      >
        <TextField
          floatingLabelText="Text"
          fullWidth={true}
          name="text"
          value={this.state.text}
          onChange={this.handleChange}
        />
        <TextField
          className={formStyles['half-input']}
          floatingLabelText="Time in seconds"
          name="time"
          value={this.state.time || ''}
          type="number"
          onChange={this.handleChange}
        />
        <TextField
          className={formStyles['half-input']}
          floatingLabelText="Priority"
          value={this.state.priority || ''}
          name="priority"
          onChange={this.handleChange}
          type="number"
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

