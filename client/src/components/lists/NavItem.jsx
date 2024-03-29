import React, { Component } from 'react';
import { withRouter } from 'react-router/es';
import ImageButton from '../buttons/ImageButton';

class NavItem extends Component {
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
    let className="NavItem";
    if (this.props.className)
      className += ' '+this.props.className;

    return (
      <div className={className}>
        <ImageButton onClick={this.handleClick} imgUrl={this.props.imgSrc} text={this.props.title} />
      </div>
    );
  }
};

NavItem.propTypes = {
  imgSrc: React.PropTypes.string,
  path: React.PropTypes.string,
  title: React.PropTypes.string,
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

NavItem.defaultProps = {

};

NavItem = withRouter(NavItem);

export default NavItem;