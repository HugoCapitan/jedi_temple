import React from 'react'

import CheckBox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'
import RadioButton from 'material-ui/RadioButton'
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup'
import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'

import dialogStyles from '../styles/dialogs'

const CustomFieldEdit = ({ custom, onSave }) => (
  <div className={dialogStyles['left-border']}>
    <List>
      <ListItem disabled={true} primaryText={`Type: ${custom.type}`}/>
      <ListItem primaryText="Show in site" leftCheckbox={<CheckBox checked={custom.show} />} />
      <ListItem primaryText="Allow filter" leftCheckbox={<CheckBox checked={custom.filter} />} />
      <Divider />
    { custom.type === 'number' ?
      <ListItem disabled={true} innerDivStyle={{ paddingTop: '0' }}>
        <TextField 
          floatingLabelText="Min Value (Leave blank for auto)"
          fullWidth={true}
          value={custom.min && custom.min != 'auto' ? custom.min : undefined} 
        />
        <TextField 
          floatingLabelText="Max Value" 
          fullWidth={true}
          value={custom.max && custom.max != 'auto' ? custom.max : undefined} 
        />
        <TextField 
          floatingLabelText="Unit (For display porpouses)" 
          fullWidth={true}
          value={custom.unit} 
        />
        <p>Unit Position</p>        
        <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
          <RadioButton
            value="light"
            label="Right"
          />
          <RadioButton
            value="not_light"
            label="Left"
          />
        </RadioButtonGroup>
      </ListItem>
    :
      <div>
        <ListItem 
          disabled={true}
          primaryText="Values"
          initiallyOpen={true}
          rightIconButton={(
            <IconButton>
              <IconContentAddCircle />
            </IconButton>
          )}
        />
        <List>
          <Divider inset={true}/>
          {custom.values.map(cValue => (
            <ListItem 
              primaryText={cValue.value}
              insetChildren={true}
              rightIconButton={
                <IconButton onClick={}>
                  <IconContentRemoveCircle />
                </IconButton>
              }
          />
          ))}
        </List>
      </div>
    }
    </List>
    <div style={{ display: 'inline-block', width:'100%' }}>
      <FlatButton
        label="Save"
        onClick={onSave}
        primary={true}
        style={{ float: 'right',  margin: '0 10px 5px 0' }}
      />
      <FlatButton
        label="Cancel"
        onClick={onSave}
        primary={true}
        style={{ float: 'right',  margin: '0 0 5px 0' }}
      />
    </div>
  </div>
)

export default CustomFieldEdit
