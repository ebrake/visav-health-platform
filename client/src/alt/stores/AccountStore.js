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

    this.exportPublicMethods({
      getUser: this.getUser
    })
  }

  /* ACTION HANDLERS */
  handleLogin(response) {
    if (response && response.data && response.data.status === 'success') {
      this.user = response.data.user;
      localStorage.setItem('accessToken', response.data.token.id);
    } else {
      this.user = undefined;
    }
  }

  handleCreateUser(response) {

  }

  handleUpdateUser(response) {
    if (response && response.data && response.data.status === 'success') {
      this.user = response.data.user;
    }
  }

  handleLogout() {
    this.user = undefined;
  }

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

    console.log('got related people:');
    console.dir(this.people);
  }

  /* PUBLIC METHODS */
  getUser() {
    return this.state.user;
  }
}

export default alt.createStore(AccountStore, 'AccountStore');