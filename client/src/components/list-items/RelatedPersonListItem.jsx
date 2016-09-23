import React, { Component } from 'react';
import ImageButton from '../buttons/ImageButton';

class RelatedPersonListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
  relation: React.PropTypes.string.isRequired,
  onClickValue: React.PropTypes.func,
  onClickRemove: React.PropTypes.func
};

export default RelatedPersonListItem;