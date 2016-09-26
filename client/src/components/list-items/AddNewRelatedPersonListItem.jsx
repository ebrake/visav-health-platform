import React, { Component } from 'react';
import ImageButton from '../buttons/ImageButton';
import VisavInput from '../inputs/VisavInput';
import OrganizationStore from '../../alt/stores/OrganizationStore'

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
    let organizationState = OrganizationStore.getState();
    var people;
    if (relation === 'patient') {
      people = organizationState.patients;
    }
    else if (relation === 'doctor') {
      people = organizationState.doctors;
    }
    else if (relation === 'caregiver') {
      people = organizationState.caregivers;
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
    this.props.onAddNewRelation(event, this.props.relation, this.state.foundPerson);
  }

  render() {
    var addButton = this.state.foundPerson ?
    <ImageButton text='Add' onClick={ this.addNewRelation } />:
    <ImageButton className='disabled' text='Not Found' />
    return (
      <li className="AddNewRelatedPersonListItem" >
        <VisavInput label={'Add new ' + this.props.relation + ' relation'} valueDidChange={ this.inputValueChanged } />
        {addButton}
      </li>
    );
  }
};

AddNewRelatedPersonListItem.propTypes = {
  relation: React.PropTypes.string.isRequired,
  valueDidChange: React.PropTypes.func,
  onAddNewRelation: React.PropTypes.func
};

export default AddNewRelatedPersonListItem;