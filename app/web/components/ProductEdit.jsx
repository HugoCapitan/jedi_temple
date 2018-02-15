import React from 'react'
import PropTypes from 'prop-types'

import Dialog      from 'material-ui/Dialog'
import FlatButton  from 'material-ui/FlatButton'
import MenuItem    from 'material-ui/MenuItem'
import TextField   from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'

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

  handleNumberCustomChange(event) {
    const self = this
    const id        = event.target.name
    const value     = event.target.value
    const hasCustom = self.state.customs.find(custom => custom.custom_id === id)
    console.log(value)

      
    if (hasCustom && event.target.value != '0' && !+event.target.value) {
      self.setState({
        ...self.state,
        customs: self.state.customs.filter(custom => custom.custom_id != id)
      })
    } else if (hasCustom) {
      self.setState({
        ...self.state,
        customs: self.state.customs.map(custom => custom.custom_id === id ? { ...custom, value } : custom)
      })
    } else {
      self.setState({
        ...self.state,
        customs: [ ...self.state.customs, { custom_id: id, value } ]
      })
    }
  }

  handleStringCustomChange(event, index, value, id) {
    const self = this
    const hasCustom = self.state.customs.find(custom => custom.custom_id === id) 

    if (hasCustom && value) {
      self.setState({
        ...self.state,
        customs: self.state.customs.map(custom => custom.custom_id === id ? {...custom, value} : custom)
      })
    } else if (!hasCustom && value) {
      self.setState({
        ...self.state,
        customs: [ ...self.state.customs, { custom_id: id, value } ]
      })
    } else if (hasCustom && !value) {
      self.setState({
        ...self.state,
        customs: self.state.customs.filter(custom => custom.custom_id != id)
      })
    }
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
            {this.props.customs.map((custom, index) => {
              const pCustom = this.state.customs.find(c => c.custom_id === custom._id)
              if (pCustom) console.log(pCustom)
              if (custom.type === 'string')
                return (
                  <SelectField
                    floatingLabelText={custom.name}
                    fullWidth={true}
                    key={index}
                    name={custom._id}
                    onChange={(event, index, value) => {
                      this.handleStringCustomChange.call(this, event, index, value, custom._id)
                    }}
                    value={!!pCustom ? pCustom.value : undefined}
                  >
                    <MenuItem value={null} primaryText="" />                    
                    {custom.values.map((cValue, cIndex) => (
                      <MenuItem key={cIndex} value={cValue._id} primaryText={cValue.value} />
                    ))}
                  </SelectField> 
                )
              else
                return (
                  <TextField
                    floatingLabelText={custom.name}
                    fullWidth={true}
                    key={index}
                    name={custom._id}
                    onChange={this.handleNumberCustomChange.bind(this)}
                    type="number"
                    value={!!pCustom ? pCustom.value : ''}
                  /> 
                )
              }
            )}
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
