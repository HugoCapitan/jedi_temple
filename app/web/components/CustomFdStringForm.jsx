import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import IconActionOk from 'material-ui/svg-icons/action/done'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import IconNavigationClose from 'material-ui/svg-icons/navigation/close'
import ListItem from 'material-ui/List/ListItem'
import TextField from 'material-ui/TextField'

import formStyles from '../styles/form'

class CustomFdStringForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { openInput: false, inputVal: '' }

    this.addValue = this.addValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this)
    this.removeValue = this.removeValue.bind(this)
    this.toggleInput = this.toggleInput.bind(this)
  }

  addValue() {
    const exists = this.props.values.find(cVal => cVal.value === this.state.inputVal)

    if (!exists) {
      const newValues = [
        { value: this.state.inputVal },
        ...this.props.values
      ]
      this.props.reportChange('values', newValues)
      this.setState({
        openInput: false,
        inputVal: ''
      })
    }
  }

  handleChange(ev) {
    this.setState({
      inputVal: ev.target.value
    })
  }

  handleInputKeyPress(ev) {
    if (ev.key === 'Enter') this.addValue()
  }

  removeValue(value) {
    const newVals = this.props.values.filter(cVal => cVal.value != value)
    this.props.reportChange('values', newVals)
  }

  toggleInput() {
    this.setState({
      openInput: !this.state.openInput
    })
  }

  render() {
    return (
      <div>
        <p>Values:</p>
        <Divider inset={true} />
        { this.state.openInput ?
          <div className={formStyles['inline-input__container']}>
            <TextField
              className={formStyles['inline-input__input']}
              name={'newvalue'}
              autoFocus={true}
              value={this.state.inputVal}
              onChange={this.handleChange}
              onKeyPress={this.handleInputKeyPress}
            />
            <IconButton onClick={this.addValue}>
              <IconActionOk className={formStyles['primary-action__color']} />
            </IconButton>
            <IconButton onClick={this.toggleInput}>
              <IconNavigationClose />
            </IconButton>
          </div>
          :
          <ListItem
            primaryText="Add New Value"
            onClick={this.toggleInput}
            leftIcon={ <IconContentAddCircle /> }
          />
        }
        {this.props.values.map((value, index) => 
          <ListItem
            key={index}
            primaryText={value.value}
            insetChildren={true}
            rightIconButton={
              <IconButton onClick={() => { this.removeValue(value.value) } }>
                <IconContentRemoveCircle />
              </IconButton>
            }
          />
        )}
      </div>
    )
  }
}

CustomFdStringForm.propTypes = {
  values: PropTypes.array.isRequired,
  reportChange: PropTypes.func.isRequired
}

export default CustomFdStringForm
