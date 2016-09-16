import React, { Component } from 'react';

class VisavInput extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isActive: false
    };
    this.valueDidChange = this.valueDidChange.bind(this);

  } 

  componentWillReceiveProps(nextProps) {
    
  }

  getInitialClasses() {
    let classes = [
      'floating-label-input'
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
        <label>{ this.props.label }</label>
        <input type={ type } placeholder={ this.props.label } onChange={ this.valueDidChange } />
      </div>
    );
  }
}

VisavInput.propTypes = {
  valueDidChange: React.PropTypes.func,
  label: React.PropTypes.string.isRequired
};

export default VisavInput;
