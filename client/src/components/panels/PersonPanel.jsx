import React, { Component } from 'react';
import { withRouter } from 'react-router';

import RelatedPersonListItem from '../list-items/RelatedPersonListItem';
import AddNewRelatedPersonListItem from '../list-items/AddNewRelatedPersonListItem';
import ImageButton from '../buttons/ImageButton';

import OrganizationActions from '../../alt/actions/OrganizationActions';
import OrganizationStore from '../../alt/stores/OrganizationStore'

class PersonPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      doctors: [],
      caregivers: []
    };

    this.listForRelation = this.listForRelation.bind(this);
    this.gotoTelesession = this.gotoTelesession.bind(this);
    this.didClickAddNewRelation = this.didClickAddNewRelation.bind(this);
    this.didClickRemoveRelation = this.didClickRemoveRelation.bind(this);
  }

  componentDidMount() {
    OrganizationActions.getRelatedPeople(this.props.person)
    .then(function(response){
      let newState = {};

      ['patients', 'doctors', 'caregivers'].forEach(function(field){
        if (response.data[field])
          newState[field] = response.data[field];
      })

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
              return <RelatedPersonListItem person={person} relation={relation} key={i} onClickValue={ this.didSelectRelatedPerson.bind(this) } onClickRemove={ this.didClickRemoveRelation }/>
            }.bind(this))
          }
          <AddNewRelatedPersonListItem relation={relation} valueDidChange={ this.addNewRelationInputValueChanged } onAddNewRelation={ this.didClickAddNewRelation } />
        </ul>
      </div>;
      
    return list;
  }

  updateStateWithRemovedRelation(relation, personToRemove) {
    let field = relation+'s';

    return function(response){
      if (response.data.status === 'success') {
        let newState = {};

        newState[field] = this.state[field].filter(person => {
          return person.id !== personToRemove.id;
        });

        this.setState(newState);
      }
    }
  }

  didClickRemoveRelation(event, relation, person) {
    if (relation === 'doctor') {
      OrganizationActions.destroyDoctorPatientRelationship(person, this.props.person)
      .then(this.updateStateWithRemovedRelation(relation, person).bind(this));
    }
    else if (relation === 'caregiver') {
      OrganizationActions.destroyCaregiverPatientRelationship(person, this.props.person)
      .then(this.updateStateWithRemovedRelation(relation, person).bind(this));
    } 
    else if (relation === 'patient') {
      if (this.props.person.role && this.props.person.role.name == 'doctor') {
        OrganizationActions.destroyDoctorPatientRelationship(this.props.person, person)
        .then(this.updateStateWithRemovedRelation(relation, person).bind(this));
      }
      else if (this.props.person.role && this.props.person.role.name == 'caregiver') {
        OrganizationActions.destroyCaregiverPatientRelationship(this.props.person, person)
        .then(this.updateStateWithRemovedRelation(relation, person).bind(this));
      }
    }
  }

  updateStateWithNewRelation(relation, person) {
    let field = relation+'s';

    return function(response){
      if (response.data.status === 'success') {
        let newState = {};

        newState[field] = this.state[field].concat([person]);

        this.setState(newState);
      }
    }
  }

  didClickAddNewRelation(event, relation, person) {
    if (relation === 'doctor') {
      OrganizationActions.makeDoctorPatientRelationship(person, this.props.person)
      .then(this.updateStateWithNewRelation(relation, person).bind(this));
    }
    else if (relation === 'caregiver') {
      OrganizationActions.makeCaregiverPatientRelationship(person, this.props.person)
      .then(this.updateStateWithNewRelation(relation, person).bind(this));
    } 
    else if (relation === 'patient') {
      if (this.props.person.role && this.props.person.role.name == 'doctor') {
        OrganizationActions.makeDoctorPatientRelationship(this.props.person, person)
        .then(this.updateStateWithNewRelation(relation, person).bind(this));
      }
      else if (this.props.person.role && this.props.person.role.name == 'caregiver') {
        OrganizationActions.makeCaregiverPatientRelationship(this.props.person, person)
        .then(this.updateStateWithNewRelation(relation, person).bind(this));
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

  gotoTelesession() {
    this.props.router.push('/telesession?patient='+this.props.person.id+'');
  }

  render() {
    var person = this.props.person;
    var relationLists;
    var telesessionButton;
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

      telesessionButton = 
      <ImageButton className="goto-telesession-button" text={"Open Telesession Lobby With "+person.firstName+' '+person.lastName} onClick={ this.gotoTelesession } />
    }

    return (
      <div className="PersonPanel panel">
        <h1 className="title">{ person.firstName + ' ' + person.lastName }</h1>
        <h2 className="role-label">{ person.role.name }</h2>
        { telesessionButton }
        { relationLists }
      </div>
    );
  }
};

PersonPanel.propTypes = {
  person: React.PropTypes.object,
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(PersonPanel);
