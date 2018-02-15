import React from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import dialogStyles from '../styles/dialogs'

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
}

class ProductEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...this.props.product }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    this.setState({ ...nextProps.product })
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
        label={this.props.title === 'New Product' ? 'Add' : 'Save'}
        primary={true}
        onClick={this.props.onSave}
      />
    ]

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        modal={true}
        contentStyle={customContentStyle}
        open={this.props.open}
      >
        <div className={dialogStyles.fullscreen}>
          <div className={dialogStyles['half-column']}>
            <TextField
              floatingLabelText="Name"
              fullWidth={true}
              name="name"
              onChange={this.handleChange.bind(this)}
              value={this.state.name}
            />
            <TextField
              floatingLabelText="Price (US$)"
              fullWidth={true}
              name="price"
              onChange={this.handleChange.bind(this)}
              type="number"
              value={this.state.price}
            />
            <br/>
            <TextField
              floatingLabelText="Stock"
              fullWidth={true}
              name="stock"
              onChange={this.handleChange.bind(this)}
              type="number"
              value={this.state.stock}
            />
            <TextField
              floatingLabelText="Description"
              fullWidth={true}
              multiLine={true}
              name="description"
              onChange={this.handleChange.bind(this)}
              rows={5}
              value={this.state.description}
            />
          </div>
          <div className={dialogStyles['half-column']}>
            
          </div>
        </div>
      </Dialog >
    )
  }
}

ProductEdit.propTypes = { 
  open:     PropTypes.bool.isRequired,
  title:    PropTypes.string.isRequired,
  product:  PropTypes.object.isRequired,
  customs:  PropTypes.array.isRequired,
  onSave:   PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ProductEdit
