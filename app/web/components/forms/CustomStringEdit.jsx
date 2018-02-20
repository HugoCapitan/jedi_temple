import React from 'react'

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
    this.setState({
      custom: { ...this.state.custom,
        values: [ ...this.state.custom.values, { value } ]
      },
      valueDialog: { open: false, text: '' }
    })
  }

  handleRemoveValue(id) {

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
      <div className={dialogStyles['left-border']}>
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
            primaryText="Values"
            initiallyOpen={true}
            rightIconButton={(
              <IconButton onClick={this.toggleValueDialog.bind(this)}>
                <IconContentAddCircle />
              </IconButton>
            )}
          />
        </List>
        <List>
          <Divider inset={true}/>
          {this.state.custom.values.map(cValue => (
            <ListItem 
              key={cValue._id}
              primaryText={cValue.value}
              insetChildren={true}
              rightIconButton={
                <IconButton onClick={this.handleRemoveValue}>
                  <IconContentRemoveCircle />
                </IconButton>
              }
          />
          ))}
        </List>

        <div className={dialogStyles['bottom-buttons']}>
          {this.props.formActions.map((action, index) => 
            <FlatButton
              label={action.label}
              onClick={action.onClick}
              primary={true}
              style={{ float: 'right',  margin: '0 10px 5px 0' }}
            />
          )}
        </div>

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
