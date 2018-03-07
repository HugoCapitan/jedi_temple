import React from 'react'
import PropTypes from 'prop-types'

import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import IconContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle-outline'
import ListItem from 'material-ui/List/ListItem'
import TextField from 'material-ui/TextField'


class CustomFdStringForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { openInput: false, inputVal: '' }
  }

  render() {
    return (
      <div>
        <ListItem
          primaryText="values"
          rightIconButton={
            <IconButton onClick={() => { this.openInput() } }>
              <IconContentAddCircle />
            </IconButton>
          }
        />
        <Divider inset={true} />
        { openInput ? 
          <TextField 
            name={'newvalue'}
            value={this.state.inputVal}
            onChange={this.handleChange}
          />
          : ''
        }
        {this.props.values.map((value, index) => 
          <ListItem
            key={index}
            primaryText={value.value}
            rightIconButton={
              <IconButton onClick={() => { this.handleRemoveValue.call(this, value.value) } }>
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
