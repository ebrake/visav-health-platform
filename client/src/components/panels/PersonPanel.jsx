import React, { Component } from 'react';
import RelatedPersonListItem from '../list-items/RelatedPersonListItem';
import AddNewRelatedPersonListItem from '../list-items/AddNewRelatedPersonListItem';

import RelationActions from '../../alt/actions/RelationActions';
import RelationStore from '../../alt/stores/RelationStore'

class PersonPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      doctors: [],
      caregivers: []
    };

    this.listForRelation = this.listForRelation.bind(this);
    this.didClickAddNewRelation = this.didClickAddNewRelation.bind(this);
  }

  componentDidMount() {
    RelationActions.getRelatedPeople(this.props.person)
    .then(function(response){
      let newState = {};
      if (response.data.patients)
        newState.patients = response.data.patients;
      if (response.data.doctors)
        newState.doctors = response.data.doctors;
      if (response.data.caregivers)
        newState.caregivers = response.data.caregivers;

      this.setState(newState);
    }.bind(this))
    .catch(err => {
      console.log('Error getting related people:');
      console.dir(err);
    })
  }

  listForRelation(relation){
    var list;
    var people;

    if (relation === 'patient') {
      people = this.state.patients;
    }
    else if (relation === 'doctor') {
      people = this.state.doctors;
    }
    else if (relation === 'caregiver') {
      people = this.state.caregivers;
    }

    list =
      <div className='relation-list'>
        <h3>{ this.props.person.firstName + '\'s ' +  relation + 's'}</h3>
        <ul className='people-list'>
          {
            people.map(function(person, i){
              return <RelatedPersonListItem person={person} key={i} onClick={ this.didSelectRelatedPerson.bind(this) }/>
            }.bind(this))
          }
          <AddNewRelatedPersonListItem relation={relation} valueDidChange={ this.addNewRelationInputValueChanged } onAddNewRelation={ this.didClickAddNewRelation } />
        </ul>
      </div>;
      
    return list;
  }

  didClickAddNewRelation(event, relation, person) {
    if (relation === 'doctor') {
      RelationActions.makeDoctorPatientRelationship(person, this.props.person)
      .then(function(response){
        if (response.data.status === 'success') {
          this.setState({
            doctors: this.state.doctors.concat([person])
          })
        }
      }.bind(this));
    }
    else if (relation === 'caregiver') {
      RelationActions.makeCaregiverPatientRelationship(person, this.props.person)
      .then(function(response){
        if (response.data.status === 'success') {
          this.setState({
            caregivers: this.state.caregivers.concat([person])
          })
        }
      }.bind(this));
    } 
    else if (relation === 'patient') {
      if (this.props.person.role && this.props.person.role.name == 'doctor') {
        RelationActions.makeDoctorPatientRelationship(this.props.person, person)
        .then(function(response){
          if (response.data.status === 'success') {
            this.setState({
              patients: this.state.patients.concat([person])
            })
          }
        }.bind(this));
      }
      if (this.props.person.role && this.props.person.role.name == 'caregiver') {
        RelationActions.makeCaregiverPatientRelationship(this.props.person, person)
        .then(function(respopatientsnse){
          if (response.data.status === 'success') {
            this.setState({
              patients: this.state.patients.concat([person])
            })
          }
        }.bind(this));
      }
    }
  }

  addNewRelationInputValueChanged(event, relation){
    console.log(relation);
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
