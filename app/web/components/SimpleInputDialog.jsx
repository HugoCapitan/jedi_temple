import React from 'react'
import PropTypes from 'prop-types'

import Dialog     from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField  from 'material-ui/TextField'

class SimpleInputDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' }
  }

  handleChange(event) {
    this.setState({
      text: event.target.value
    })
  }

  handleDone() {
    this.props.onDone(this.state.text)
  }

  render() {
    const customStyles = {
      width: 'auto',
      display: 'inline-block',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }
  
    const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.props.onCancel}
      />,
      <FlatButton
        label="Done"
        onClick={this.handleDone.bind(this)}
        primary={true}   
      />
    ]
    
    return (
      <Dialog
        actions={actions}
        open={this.props.open}
        title={this.props.title}
        contentStyle={customStyles}
      >
        <TextField 
          value={this.state.inputValue}
          onChange={this.handleChange.bind(this)}
        />
      </Dialog>
    )
  }
}

export default SimpleInputDialog


SimpleInputDialog.propTypes = { 
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onDone: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}
