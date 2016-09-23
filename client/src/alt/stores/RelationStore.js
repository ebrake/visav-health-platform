import alt from '../alt'
import RelationActions from '../actions/RelationActions';

class RelationStore {
  constructor() {
    this.doctors = [];
    this.caregivers = [];
    this.patients = [];
    this.admins = [];
    this.people = [];

    this.bindListeners({
      handleGetViewablePeople: RelationActions.GET_VIEWABLE_PEOPLE,
      handleGetRelatedPeople: RelationActions.GET_RELATED_PEOPLE,
      handleMakeDoctorPatientRelationship: RelationActions.MAKE_DOCTOR_PATIENT_RELATIONSHIP,
      handleMakeCaregiverPatientRelationship: RelationActions.MAKE_CAREGIVER_PATIENT_RELATIONSHIP
    });
  }

  /* ACTION HANDLERS */
  handleGetViewablePeople(response) {
    this.doctors = [];
    this.caregivers = [];
    this.patients = [];
    this.admins = [];
    this.people = [];

    if (response.data.people) {
      var people = response.data.people;
      people.forEach(function(person){
        person.fullName = person.firstName + ' ' + person.lastName;
        this.people.push(person);
        
        if (person.role.name === 'doctor') {
          this.doctors.push(person);
        }
        else if (person.role.name === 'caregiver') {
          this.caregivers.push(person);
        }
        else if (person.role.name === 'patient') {
          this.patients.push(person);
        }
        else if (person.role.name === 'admin') {
          this.admins.push(person);
        }
      }.bind(this))
    }
  }

  handleGetRelatedPeople(response) {

  }

  handleMakeDoctorPatientRelationship(response) {
    console.log('Made doctor patient relationship:');
    console.dir(response);
  }

  handleMakeCaregiverPatientRelationship(response) {
    console.log('Made doctor patient relationship:');
    console.dir(response);
  }
}

export default alt.createStore(RelationStore, 'RelationStore');