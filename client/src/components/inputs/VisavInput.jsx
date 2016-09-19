import React, { Component } from 'react';

class VisavInput extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isActive: (this.props.value && this.props.value.length > 0) ? true : false
    };

    this.valueDidChange = this.valueDidChange.bind(this);
  } 

  componentWillReceiveProps(nextProps) {
    
  }

  getInitialClasses() {
    let classes = [
      'floating-label-input',
      'VisavInput'
    ];

    let userClasses = this.props.className || '';

    userClasses.split(' ').forEach((name) => {
      classes.push(name);
    });

    return classes;
  }

  valueDidChange(event){
    let value = event.target.value;

    this.setState({
      isActive: (value.length > 0)
    });

    this.props.valueDidChange(event);
  }

  render() {
    let type = this.props.type || 'text';

    let classes = this.getInitialClasses();

    if (this.state.isActive) {
      classes.push('is-active');
    }

    return (
      <div className={ classes.join(' ') }>
        <label>{ this.state.isActive ? this.props.label : null }</label>
        <input type={ type } placeholder={ this.props.label } value={ this.props.value } onChange={ this.valueDidChange } {...this.props} />
      </div>
    );
  }
}

VisavInput.propTypes = {
  valueDidChange: React.PropTypes.func,
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  onKeyUp: React.PropTypes.func
};

export default VisavInput;
