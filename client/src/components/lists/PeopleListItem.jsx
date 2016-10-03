import React, { Component } from 'react';
import ImageButton from '../buttons/ImageButton';
import AccountStore from '../../alt/stores/AccountStore';
import OrganizationActions from '../../alt/actions/OrganizationActions';
import VisavIcon from '../misc/VisavIcon';

class PeopleListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: AccountStore.getRole()
    };

    this.handleClick = this.handleClick.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }  

  handleClick(event){
    this.props.onClick(event, this.props.person);
  }

  removeUser(event) {
    OrganizationActions.removeUser(this.props.person)
    .then(function(response){
      console.log('Removed user?');
      console.dir(response);
    })
  }

  render() {
    var removeButton = null;

    if (this.state.role === 'admin') {
      removeButton = <VisavIcon className="destructive" type="remove" onClick={ this.removeUser } />
    }

    return (
      <li className="PeopleListItem" onClick={ this.handleClick }>
        <span>{this.props.person.firstName+' '+this.props.person.lastName}</span>
        { removeButton }
      </li>
    );
  }
};

PeopleListItem.propTypes = {
  person: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func
};

export default PeopleListItem;