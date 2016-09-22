import React, { Component } from 'react';
import ImageButton from '../buttons/ImageButton';
import VisavInput from '../inputs/VisavInput';
import AccountStore from '../../alt/stores/AccountStore'

class AddNewRelatedPersonListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foundPerson: null
    };
    this.inputValueChanged = this.inputValueChanged.bind(this);
    this.addNewRelation = this.addNewRelation.bind(this);

  }  

  inputValueChanged(event){
    var searchString = event.target.value;
    var relation = this.props.relation;
    let accountState = AccountStore.getState();
    var people;
    if (relation === 'patient') {
      people = accountState.patients;
    }
    else if (relation === 'doctor') {
      people = accountState.doctors;
    }
    else if (relation === 'caregiver') {
      people = accountState.caregivers;
    }
    var foundPerson;
    people.forEach(function(person) {
      var fullName = person.firstName + ' ' + person.lastName;
      if (searchString === fullName) {
        foundPerson = person;
      }
    });
    this.setState({ foundPerson: foundPerson });

    this.props.valueDidChange(event, this.props.relation);
  }

  addNewRelation(event){
    var person = this.state.foundPerson
    console.log('Attempting to add ' + person.firstName + ' ' + person.lastName);
  }

  render() {
    var addButton = <ImageButton text='Add' onClick={ this.addNewRelation } />
    return (
      <li className="AddNewRelatedPersonListItem" >
        <VisavInput label={'Add new ' + this.props.relation + ' relation'} valueDidChange={ this.inputValueChanged } />
        <span className="found-indicator">{ this.state.foundPerson ? addButton : 'Not Found' }</span>
      </li>
    );
  }
};

AddNewRelatedPersonListItem.propTypes = {
  relation: React.PropTypes.string.isRequired,
  valueDidChange: React.PropTypes.func
};

export default AddNewRelatedPersonListItem;