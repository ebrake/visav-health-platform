import React from 'react';
import PersonPanel from '../panels/PersonPanel';
import PeopleListPanel from '../panels/PeopleListPanel';
import Banner from '../misc/Banner';
import AccountStore from '../../alt/stores/AccountStore'
import FullscreenAlert from '../misc/FullscreenAlert';
import AuthenticatedPage from './AuthenticatedPage';

class People extends React.Component {
  
  constructor(props) {
    super(props);

    let user = AccountStore.getUser();

    if (user.role.name === 'doctor'){
      this.allowedPeopleLists = ['patients', 'caregivers'];
    }
    else if (user.role.name === 'patient'){
      this.allowedPeopleLists = ['doctors', 'caregivers'];
    }
    else if (user.role.name === 'caregiver'){
      this.allowedPeopleLists = ['doctors', 'patients'];
    }
    else if (user.role.name === 'owner' || user.role.name === 'admin'){
      this.allowedPeopleLists = ['doctors', 'patients', 'caregivers', 'admins'];
    }

    this.state = {
      showPersonPopup: false,
      displayedPerson: null,
      showUnderConstructionBanner: false
    };

    this.closePersonPopup = this.closePersonPopup.bind(this);
    this.handleDidSelectPerson = this.handleDidSelectPerson.bind(this);
  }

  handleDidSelectPerson(event, person){
    console.dir(person);
    this.setState({ showPersonPopup: true, displayedPerson: person });
  }

  closePersonPopup(){
    this.setState({ showPersonPopup: false,  displayedPerson: null });
  }

  componentDidMount(){
    this.setState({ showUnderConstructionBanner: true });
  }


  render() {

    return (
      <div className="People content-container">
        <Banner active={ this.state.showUnderConstructionBanner } text="This feature is under development. It fulfills a function that we need access to, but has not yet been properly styled or had UX concerns addressed. We apologize for any non-intuitive use cases." />

        <div className="PeopleListContainer row-gt-sm">
          <FullscreenAlert 
            active={ this.state.showPersonPopup } 
            onClickOutside={ this.closePersonPopup.bind(this) }  
            content={<PersonPanel person={ this.state.displayedPerson } />} 
          ></FullscreenAlert>

          {
            this.allowedPeopleLists.map(function(role, i){
              return <PeopleListPanel displayedRole={role}  key={i} onSelectPerson={ this.handleDidSelectPerson } />
            }.bind(this))
          }
        </div>
      </div>
    );
  }
}

//eslint-disable-next-line
export default AuthenticatedPage(People);
