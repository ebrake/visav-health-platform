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
      handleGetPeople: RelationActions.GET_PEOPLE
    });
  }

  /* ACTION HANDLERS */
  handleGetPeople(response){
    this.doctors = [];
    this.caregivers = [];
    this.patients = [];
    this.admins = [];
    this.people = [];

    if (response.data.people) {
      var people = response.data.people;
      people.forEach(function(person){
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
}

export default alt.createStore(RelationStore, 'RelationStore');