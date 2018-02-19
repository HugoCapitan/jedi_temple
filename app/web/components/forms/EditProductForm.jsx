import React from 'react'
import PropTypes from 'prop-types'

import FlatButton  from 'material-ui/FlatButton'
import MenuItem    from 'material-ui/MenuItem'
import TextField   from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'

import CustomFieldDropdown from '../CustomFieldDropdown'

import dialogStyles from '../../styles/dialogs'

class EditProductForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...this.props.product }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps.product })
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleNumberCustomChange(event) {
    const id        = event.target.name
    const value     = event.target.value
    const hasCustom = this.state.customs.find(custom => custom.custom_id === id)
      
    // Evaluate if product has this custom already and value is false (not zero but empty)
    if (hasCustom && value != '0' && !+value) this.setState( removeCustom(this.state, id) )
    else if (hasCustom) this.setState( editCustom(this.state, id, value) )
    else this.setState( addCutsom(this.state, id, value) )
  }

  handleStringCustomChange(event, value, id) {
    const hasCustom = this.state.customs.find(custom => custom.custom_id === id) 

    if (hasCustom && value) this.setState( editCustom(this.state, id, value) )
    else if (!hasCustom && value) this.setState( addCutsom(this.state, id, value) )
    else if (hasCustom && !value) this.setState( removeCustom(this.state, id) )
  }

  render() {
    return (
      <div className={dialogStyles.fullscreen}>
        <div className={dialogStyles['bottom-buttons']}>
          {this.props.actions.map((action, index) => 
            <FlatButton
              key={index}
              label={action.label}
              primary={true}
              onClick={() => { action.onClick(this.state, this.props.product) }}
            />
          )}
        </div>
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
            let pCustom = this.state.customs.find(c => c.custom_id === custom._id)
            if (!pCustom) pCustom = {}
            if (custom.type === 'string')
              return (
                <CustomFieldDropdown 
                  custom={custom}
                  handleChange={this.handleStringCustomChange.bind(this)}
                  key={index}
                  selected={pCustom.value}
                />
              )
            else
              return (
                <TextField
                  floatingLabelText={`${custom.name} (${custom.unit})`}
                  fullWidth={true}
                  key={index}
                  name={custom._id}
                  onChange={this.handleNumberCustomChange.bind(this)}
                  type="number"
                  value={pCustom.value || ''}
                /> 
              )
            }
          )}
        </div>
      </div>
    )
  }
}

EditProductForm.propTypes = { 
  product:  PropTypes.object.isRequired,
  customs:  PropTypes.array.isRequired,
  onSave:   PropTypes.func.isRequired
}

export default EditProductForm


function addCutsom(state, custom_id, value) {
  return {
    customs: [ ...state.customs, { custom_id, value } ]
  }
}

function editCustom(state, id, value) {
  return {
    customs: state.customs.map(c => c.custom_id === id ? { ...c, value } : c)
  }
}

function removeCustom(state, id) {
  return {
    customs: state.customs.filter(c => c.custom_id != id)
  }
}
