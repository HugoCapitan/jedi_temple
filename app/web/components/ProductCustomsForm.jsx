import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

class ProductCustomsForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleStringChange = this.handleStringChange.bind(this)
    this.handleNumberChange = this.handleNumberChange.bind(this)
  }

  handleNumberChange(event) {
    const id        = event.target.name
    const value     = event.target.value
    const hasCustom = this.props.prodCustoms.find(custom => custom.custom_id === id)
      
    // Evaluate if product has this custom already and value is false (not zero but empty)
    if (hasCustom && value != '0' && !+value) this.props.reportChange( 
      removeCustom(this.props.prodCustoms, id) 
    )
    else if (hasCustom) this.props.reportChange( 
      editCustom(this.props.prodCustoms, id, value)
    )
    else this.props.reportChange(
      addCustom(this.props.prodCustoms, id, value)
    )
  }

  handleStringChange(value, id) {
    const hasCustom = this.props.prodCustoms.find(custom => custom.custom_id === id) 

    if (hasCustom && value) this.props.reportChange( 
      editCustom(this.props.prodCustoms, id, value)
    )
    else if (!hasCustom && value) this.props.reportChange(
      addCustom(this.props.prodCustoms, id, value)
    )
    else if (hasCustom && !value) this.props.reportChange( 
      removeCustom(this.props.prodCustoms, id) 
    )
  }

  render() {
    return(
      <div>
        {this.props.customs.map((custom, index) => {
          let prodCustom = this.props.prodCustoms.find(pc => pc.custom_id === custom._id) || {}
          
          return custom.type === 'string'
          ? 
          <SelectField
            floatingLabelText={custom.name}
            fullWidth={true}
            key={index}
            name={custom._id}
            onChange={(e, i, v) => { this.handleStringChange(v, custom._id) }}
            value={prodCustom.value}
          >
            <MenuItem value={undefined} primaryText="" />                    
            {custom.values.map((cVal, index) => (
              <MenuItem key={index} value={cVal._id} primaryText={cVal.value} />
            ))}
          </SelectField>
          :
          <TextField
            floatingLabelText={`${custom.name} (${custom.unit})`}
            fullWidth={true}
            key={index}
            name={custom._id}
            onChange={this.handleNumberChange}
            type="number"
            value={prodCustom.value || ''}
          />
        })}
      </div>
    )
  }
}

ProductCustomsForm.propTypes = {
  customs: PropTypes.array.isRequired,
  prodCustoms: PropTypes.array.isRequired,
  reportChange: PropTypes.func.isRequired
}

export default ProductCustomsForm


function addCustom(customs, custom_id, value) {
  return [ ...customs, { custom_id, value } ]
}

function editCustom(customs, id, value) {
  return customs.map(c => c.custom_id === id ? { ...c, value } : c)
}

function removeCustom(customs, id) {
  return customs.filter(c => c.custom_id != id)
}
