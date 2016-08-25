import React, { Component } from 'react';
import { withRouter } from 'react-router';
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
      <div className="NavItem" onClick={this.handleClick}>
        { this.props.imgSrc ? 
          <div className="img-container">
            <img src={this.props.imgSrc} /> 
          </div>
          : 
          null }
        <span>{this.props.title}</span>
      </div>
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