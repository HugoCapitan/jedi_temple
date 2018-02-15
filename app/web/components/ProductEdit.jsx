import React from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
}

class ProductEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...this.props.product }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.onCancel}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.props.onSave}
      />
    ]

    return (
      <Dialog
        title={this.props.title}
        actions={this.props.actions}
        modal={true}
        contentStyle={customContentStyle}
        open={this.props.open}
      >
        <TextField
          value={this.state.name}
          name="name"
          floatingLabelText="Name"
          onChange={this.handleChange.bind(this)}
        />
      </Dialog>
    )
  }
}

ProductEdit.propTypes = { 
  open:     PropTypes.bool.isRequired,
  title:    PropTypes.string.isRequired,
  product:  PropTypes.object.isRequired,
  onSave:   PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ProductEdit
