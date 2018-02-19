import React from 'react'

import CheckBox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'

import dialogStyles from '../../styles/dialogs'

const CustomFieldEdit = ({ custom, formActions, onValueAdd, onValueRemove }) => (
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
          <IconButton onClick={onValueAdd}>
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
            <IconButton onClick={onValueRemove}>
              <IconContentRemoveCircle />
            </IconButton>
          }
      />
      ))}
    </List>

    <div className={dialogStyles['bottom-buttons']}>
      {formActions.map((action, index) => 
        <FlatButton
          label={action.label}
          onClick={action.onClick}
          primary={true}
          style={{ float: 'right',  margin: '0 10px 5px 0' }}
        />
      )}
    </div>
  </div>
)

export default CustomFieldEdit
