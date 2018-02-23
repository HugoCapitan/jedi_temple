import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'

import SimpleInputDialog from '../SimpleInputDialog'

import dialogStyles from '../../styles/dialogs'

class CustomStringEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = { custom: this.props.custom, valueDialog: { open: false, text: '' } }
  }

  handleAddValue(value) {
    const exists = this.state.custom.values.find(cVal => cVal.value === value)

    if (!exists)
      this.setState({
        custom: { ...this.state.custom,
          values: [ { value }, ...this.state.custom.values ]
        }
      })

    this.setState({ valueDialog: { open: false, text: '' } })
  }

  handleRemoveValue(value) {
    this.setState({ 
      custom: { ...this.state.custom,
        values: this.state.custom.values.filter(cVal => cVal.value != value)
      } 
    })
  }

  handleCheck(event, isChecked) {
    this.setState({ custom: { 
      ...this.state.custom, 
      [event.target.name]: isChecked 
    } })
  }

  toggleValueDialog() {
    this.setState({ valueDialog: {
      open: !this.state.valueDialog.open,
      text: ''
    } })
  }

  render() {
    return (
      <div className={dialogStyles['left-border']} style={ { overflowY: 'scroll' } }>
        <List>
          <ListItem disabled={true} primaryText="Field Type: String"/>
          <ListItem 
            primaryText="Show in site" 
            leftCheckbox={<CheckBox checked={this.state.custom.show} name="show" onCheck={this.handleCheck.bind(this)} />} 
          />
          <ListItem 
            primaryText="Allow filter" 
            leftCheckbox={<CheckBox checked={this.state.custom.filter} name="filter" onCheck={this.handleCheck.bind(this)} />} 
          />
          <Divider />
          <ListItem
            disabled={true}
            primaryText="Values:"
            initiallyOpen={true}
            rightIconButton={(
              <IconButton onClick={this.toggleValueDialog.bind(this)}>
                <IconContentAddCircle />
              </IconButton>
            )}
          />
          <Divider inset={true}/>
          {this.state.custom.values.map((cValue, index) => (
            <ListItem 
              key={index}
              primaryText={cValue.value}
              insetChildren={true}
              rightIconButton={
                <IconButton onClick={() => { this.handleRemoveValue.call(this, cValue.value) } }>
                  <IconContentRemoveCircle />
                </IconButton>
              }
          />
          ))}
          <ListItem disabled={true} style={{ textAlign: 'right', padding: '16px 10px 5px 16px' }}>
            {this.props.formActions.map((action, index) => 
              <FlatButton
                key={index}
                label={action.label}
                onClick={() => { action.onClick(this.state.custom) } }
                primary={action.primary}
              />
            )}
          </ListItem>
        </List>

        <SimpleInputDialog 
          open={this.state.valueDialog.open}
          title="New Value"
          onDone={this.handleAddValue.bind(this)}
          onCancel={this.toggleValueDialog.bind(this)}
        />
      </div>
    )
  }
}

export default CustomStringEdit

CustomStringEdit.propTypes = {
  custom: PropTypes.object.isRequired,
  formActions: PropTypes.array.isRequired
}
