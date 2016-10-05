import React, { Component } from 'react';
import Dropdown from 'react-dropdown';

class VisavDropdown extends Component {
  constructor(props){
    super(props);

    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.getClasses = this.getClasses.bind(this);
  } 

  getClasses() {
    let classes = [
      'VisavDropdown'
    ];

    let userClasses = this.props.className || '';

    userClasses.split(' ').forEach((name) => {
      classes.push(name);
    });

    return classes;
  }

  onChange(selected) {
    this.props.onChange(selected);
  }

  render() {
    let classes = this.getClasses();
    let value = this.props.value;

    return (
      <div className={classes.join(' ')}>
        <Dropdown options={this.props.options} value={value} onChange={this.onChange} placeholder={this.props.placeholder || 'Select an option...'} />
      </div>
    );
  }
}

VisavDropdown.propTypes = {
  options: React.PropTypes.array,
  onChange: React.PropTypes.func,
  placeholder: React.PropTypes.string
};

export default VisavDropdown;
