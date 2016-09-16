import React, { Component } from 'react';

class VisavInput extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isActive: false
    };
  } 

  componentWillReceiveProps(nextProps) {
    let value = nextProps.value;

    this.setState({
      isActive: (value.length > 0)
    });
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

  render() {
    let type = this.props.type || 'text';

    let classes = this.getInitialClasses();

    if (this.state.isActive) {
      classes.push('is-active');
    }

    return (
      <div className={ classes.join(' ') }>
        <label>{ this.props.label }</label>
        <input type={ type } placeholder={ this.props.label } onChange={ this.props.onChange } />
      </div>
    );
  }
}

export default VisavInput;
