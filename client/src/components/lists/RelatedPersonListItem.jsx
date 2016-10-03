import React, { Component } from 'react';
import ImageButton from '../buttons/ImageButton';
import AccountStore from '../../alt/stores/AccountStore';

class RelatedPersonListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      role: AccountStore.getRole()
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);

  }  

  handleClick(event){
    this.props.onClickValue(event, this.props.person);
  }

  handleClickRemove(event){
    this.props.onClickRemove(event, this.props.relation, this.props.person);
  }

  render() {
    var removeButton = null;

    if (this.state.role == 'admin') {
      removeButton = <ImageButton className='remove-button destructive' onClick={ this.handleClickRemove } text='Remove' />
    }

    return (
      <li className="RelatedPersonListItem" >
        <span onClick={ this.handleClick }>{ this.props.person.firstName + ' ' + this.props.person.lastName }</span>
        { removeButton }
      </li>
    );
  }
};

RelatedPersonListItem.propTypes = {
  person: React.PropTypes.object.isRequired,
  relation: React.PropTypes.string.isRequired,
  onClickValue: React.PropTypes.func,
  onClickRemove: React.PropTypes.func
};

export default RelatedPersonListItem;