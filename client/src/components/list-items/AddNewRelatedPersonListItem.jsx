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
    this.autocompleteDidSelect = this.autocompleteDidSelect.bind(this);
    this.addNewRelation = this.addNewRelation.bind(this);

  }  

  autocompleteDidSelect(item){
    console.log('setting autocomplete did select');
    console.dir(item);
    this.setState({ foundPerson: item });
  }

  peopleForRelation(){
    let relationState = RelationStore.getState();
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
    return people;
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
        <VisavInput 
          autocompleteObjects={ this.peopleForRelation() }
          autocompleteKeys={['fullName', 'firstName', 'lastName', 'email']}
          label={'Add new ' + this.props.relation + ' relation'} 
          autocompleteDidSelect={ this.autocompleteDidSelect }
          valueDidChange = { this.props.valueDidChange }  
        />
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