import React, { Component } from 'react';
import { withRouter } from 'react-router/es';
import VisavIcon from '../misc/VisavIcon';

class NavIcon extends Component {
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
    let className="NavIcon";
    if (this.props.className)
      className += ' '+this.props.className;

    return (
      <div className={className}>
        <VisavIcon onClick={this.handleClick} type={this.props.type} selected={this.props.selected} />
      </div>
    );
  }
};

NavIcon.propTypes = {
  path: React.PropTypes.string,
  selected: React.PropTypes.bool,
  type: React.PropTypes.string,
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

NavIcon.defaultProps = {

};

NavIcon = withRouter(NavIcon);

export default NavIcon;