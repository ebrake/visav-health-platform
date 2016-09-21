import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ImageButton from '../buttons/ImageButton';

class NavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }  

  handleClick(){
    if (this.props.path) {
      this.props.router.push(this.props.path);
    }
    else { 
      this.props.router.push('/'+this.props.title);
    }
  }
  render() {
    return (
      <ImageButton className="NavItem" onClick={this.handleClick} imgUrl={this.props.imgSrc} text={this.props.title} />
    );
  }
};

NavItem.propTypes = {
  imgSrc: React.PropTypes.string,
  path: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

NavItem.defaultProps = {

};

NavItem = withRouter(NavItem);

export default NavItem;