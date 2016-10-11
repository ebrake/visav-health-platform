import React from 'react';
import Dropdown from 'react-dropdown';

class VisavDropdown extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      active: false
    };

    this.handleChange = this.handleChange.bind(this);
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

    if (this.state.active === true) {
      classes.push('active');
    }

    return classes;
  }

  handleChange(selected) {
    this.setState({
      active: true
    })
    this.props.onChange(selected);
  }

  render() {
    let classes = this.getClasses();
    let value = this.props.value;

    return (
      <div className={classes.join(' ')}>
        <Dropdown options={this.props.options} value={value} onChange={this.handleChange} placeholder={this.props.placeholder || 'Select an option...'} />
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
