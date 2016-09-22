import React, { Component } from 'react';
import ImageButton from '../buttons/ImageButton';

class RelatedPersonListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);

  }  

  handleClick(event){
    this.props.onClick(event, this.props.person);
  }

  handleClickDelete(event){
    this.props.handleClickRemove(event, this.props.person);
  }

  render() {
    return (
      <li className="RelatedPersonListItem" >
        <span onClick={ this.handleClick }>{ this.props.person.firstName + ' ' + this.props.person.lastName }</span>
        <ImageButton className='remove-button' onClick={ this.handleClickRemove } text='Remove' />
      </li>
    );
  }
};

RelatedPersonListItem.propTypes = {
  person: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func,
  handleClickRemove: React.PropTypes.func
};

export default RelatedPersonListItem;