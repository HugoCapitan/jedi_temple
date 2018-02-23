import React from 'react'
import PropTypes from 'prop-types'

import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'
import RadioButton from 'material-ui/RadioButton'
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup'
import TextField from 'material-ui/TextField'

class NewCustom extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...this.props.custom }
  }

  render() {
    return (
      <div>
        <List>
          <ListItem innerDivStyle={{ paddingTop: '0' }}>
            <TextField 
              floatingLabelText="Name"
              fullWidth={true}
            />
          </ListItem>
        </List>
      </div>
    )
  }
}

export default NewCustom


NewCustom.propTypes = {

}
