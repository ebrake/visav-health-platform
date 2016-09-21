import React, { Component } from 'react';
import ImageButton from '../buttons/ImageButton';

class PeopleListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }  

  handleClick(){

  }

  render() {
    return (
      <li className="PeopleListItem" onClick={ this.handleClick }>
        { this.props.person.firstName + ' ' + this.props.person.lastName }
      </li>
    );
  }
};

PeopleListItem.propTypes = {
  person: React.PropTypes.object.isRequired
};

export default PeopleListItem;