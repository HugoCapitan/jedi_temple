import React from 'react'

import CheckBox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'

import dialogStyles from '../styles/dialogs'

const CustomFieldEdit = ({ custom, onSave }) => (
  <div className={dialogStyles['left-border']}>
    <List>
      <ListItem disabled={true} primaryText={`Type: ${custom.type}`}/>
      <ListItem primaryText="Show in site" leftCheckbox={<CheckBox checked={custom.show} />} />
      <ListItem primaryText="Allow filter" leftCheckbox={<CheckBox checked={custom.filter} />} />
      <Divider />
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
    </List>
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
