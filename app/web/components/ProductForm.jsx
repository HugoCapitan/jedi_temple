import React from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import ProductCustomsForm from './ProductCustomsForm'

import formStyles from '../styles/form'
import gridStyles from '../styles/grid'

class ProductForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props.product }

    this.handleChange = this.handleChange.bind(this)
    this.handleCustomsChange = this.handleCustomsChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleCustomsChange(newCustoms) {
    this.setState({
      customs: newCustoms
    })
  }

  render() {
    return (
      <div className={gridStyles['container']}>
        <div>
          <div className={gridStyles['half-column']}>
            <TextField
              floatingLabelText="Name"
              fullWidth={true}
              name="name"
              onChange={this.handleChange}
              value={this.state.name}
            />
            <TextField
              floatingLabelText="Price (US$)"
              fullWidth={true}
              name="price"
              onChange={this.handleChange}
              type="number"
              value={this.state.price}
            />
            <TextField
              floatingLabelText="Stock"
              fullWidth={true}
              name="stock"
              onChange={this.handleChange}
              type="number"
              value={this.state.stock}
            />
            <TextField
              floatingLabelText="Description"
              fullWidth={true}
              multiLine={true}
              name="description"
              onChange={this.handleChange}
              rows={5}
              value={this.state.description}
            />
          </div>
          <div className={gridStyles['half-column']}>
            <ProductCustomsForm 
              customs={this.props.customs}
              prodCustoms={this.state.customs}
              reportChange={this.handleCustomsChange}
            />
          </div>
        </div>
        <div className={formStyles['bottom-actions']}>
          <FlatButton label="Save" primary={true} />
        </div>
      </div>
    )
  }
}

ProductForm.propTypes = {
  product: PropTypes.object.isRequired,
  customs: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired
}

export default ProductForm
