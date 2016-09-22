import React, { Component } from 'react';
import RelatedPersonListItem from '../list-items/RelatedPersonListItem';
import AddNewRelatedPersonListItem from '../list-items/AddNewRelatedPersonListItem';


import AccountStore from '../../alt/stores/AccountStore'

class PersonPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    let accountState = AccountStore.getState();
    this.listForRelation = this.listForRelation.bind(this);

  }

  listForRelation(relation){
    var list;
    var people;
    let accountState = AccountStore.getState();

    if (relation === 'patient') {
      people = accountState.patients;
    }
    else if (relation === 'doctor') {
      people = accountState.doctors;
    }
    else if (relation === 'caregiver') {
      people = accountState.caregivers;
    }

    list =
      <div className='relation-list'>
        <h3>{relation + 's'}</h3>
        <ul>
          {
            people.map(function(person, i){
              return <RelatedPersonListItem person={person} key={i} onClick={ this.didSelectRelatedPerson.bind(this) }/>
            }.bind(this))
          }
          <AddNewRelatedPersonListItem relation={relation} valueDidChange={ this.addNewRelationInputValueChanged } />
        </ul>
      </div>;
      
    return list;
  }

  addNewRelationInputValueChanged(event, label){
    console.log(label);
    console.log(event.target.value);
  }

  didSelectRelatedPerson(event, person){
    console.log('did select related person:');
    console.dir(person);
  }

  render() {
    var person = this.props.person;
    var relationLists;
    if ( person.role.name === 'doctor' || person.role.name === 'caregiver' ) {
      var patientList = this.listForRelation('patient');
      relationLists = 
      <div className='relation-lists'>
        { patientList }
      </div>;
    }
    else if ( person.role.name === 'patient' ) {
      var doctorList = this.listForRelation('doctor');
      var caregiverList = this.listForRelation('caregiver');

      relationLists = 
      <div className='relation-lists'>
        { doctorList }
        { caregiverList }
      </div>;
    }

    return (
      <div className="PersonPanel panel">
        <h1 className="title">{ person.firstName + ' ' + person.lastName }</h1>
        <h2 className="role-label">{ person.role.name }</h2>
        { relationLists }
      </div>
    );
  }
};

PersonPanel.propTypes = {
  person: React.PropTypes.object
};

export default PersonPanel;
