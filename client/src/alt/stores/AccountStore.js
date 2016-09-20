import alt from '../alt'
import AccountActions from '../actions/AccountActions';

class AccountStore {
  constructor() {
    this.user = undefined;
    this.role = undefined;
    this.doctors = [];
    this.caregivers = [];
    this.patients = [];
    this.people = [];

    this.bindListeners({
      handleLogin: AccountActions.LOGIN_USER,
      handleLogout: AccountActions.LOGOUT_USER,
      handleCreateUser: AccountActions.CREATE_USER,
      handleUpdateUser: AccountActions.UPDATE_USER,
      handleGetPeople: AccountActions.GET_PEOPLE
    });
  }

  handleLogin(response) {
    if (response && response.data && response.data.status === 'success') {
      this.user = response.data.user;
      this.role = (this.user.roles && this.user.roles[0]) ? this.user.roles[0].name : undefined;
      localStorage.setItem('accessToken', response.data.token.id);
    } else {
      this.user = undefined;
      this.role = undefined;
    }
  }

  handleCreateUser(response) {

  }

  handleUpdateUser(user) {
    this.user = user;
    this.role = (user.roles && user.roles[0]) ? user.roles[0].name : undefined;
  }

  handleLogout() {
    this.user = undefined;
    this.role = undefined;
  }

  handleGetPeople(response){
    this.doctors = [];
    this.caregivers = [];
    this.patients = [];
    this.people = [];

    if (response.data.people) {
      var people = response.data.people;
      for( peopleIndex in people ){
        var person = people[peopleIndex];
        this.people.push(person);
        
        if ( person.role.name == 'doctor') {
          this.doctors.push(person);
        }
        else if ( person.role.name == 'caregiver') {
          this.caregivers.push(person);
        }
        else if ( person.role.name == 'patient') {
          this.patients.push(person);
        }
      }
    }

    console.log('got related people:');
    console.dir(this.people);
  }
}

export default alt.createStore(AccountStore, 'AccountStore');