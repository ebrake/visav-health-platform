import React, { Component } from 'react';
import PeopleListItem from '../list-items/PeopleListItem';
import AccountStore from '../../alt/stores/AccountStore'

class PeopleListPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    let accountState = AccountStore.getState();

    console.log(this.props.displayedRole);

    if (this.props.displayedRole == 'doctors') {
      this.displayedPeople = accountState.doctors;
    }
    else if (this.props.displayedRole == 'patients') {
      this.displayedPeople = accountState.patients;
    }
    else if (this.props.displayedRole == 'caregivers') {
      this.displayedPeople = accountState.caregivers;
    }
    else if (this.props.displayedRole == 'admins') {
      this.displayedPeople = accountState.admins;
    }
    if (!this.displayedPeople) {
      this.displayedPeople = [];
    }
  }

  didSelectPerson(event, person){
    this.props.onSelectPerson(event, person);
  }

  render() {
    return (
      <div className="PeopleListPanel panel">
        <h1 className="title">{ this.props.displayedRole }</h1>
        <ul className="people-list">
          {
            this.displayedPeople.map(function(person, i){
              return <PeopleListItem person={person} key={i} onClick={ this.didSelectPerson.bind(this) }/>
            }.bind(this))
          }
        </ul>
      </div>
    );
  }
};

PeopleListPanel.propTypes = {
  displayedRole: React.PropTypes.string.isRequired,
  onSelectPerson: React.PropTypes.func
};

export default PeopleListPanel;
