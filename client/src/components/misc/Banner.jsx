import React, { Component } from 'react';
import VisavIcon from '../misc/VisavIcon';

class Banner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      confirmation : '',
      password : ''
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.active !== this.props.active) {
      this.setState({active: newProps.active});
    }
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  componentDidUpdate(){

  }

  handleClose(event){
    this.setState({active: false});
  }

  render() {
    if(!this.state.active){
      return null;
    }

    return (
      <div className="Banner flex-row">
        <div className="banner-text">
        <p>
          { this.props.text }
        </p>
        </div>
        <div className="banner-close">
          <VisavIcon type="close" onClick={ this.handleClose } />
        </div>
      </div>
    );
  }
};

Banner.propTypes = {
  active: React.PropTypes.bool.isRequired,
  text: React.PropTypes.string.isRequired
}

export default Banner;
