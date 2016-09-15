import React, { Component } from 'react';


class FullscreenAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
    this.handleBackgroundClick = this.handleBackgroundClick.bind(this);

  }

  componentWillReceiveProps(newProps) {
    if (newProps.active != this.props.active) {
      this.setState({active: newProps.active});
    }
  }
  handleBackgroundClick(event){
    console.log(event);
    this.props.onClose();
  }

  render() {
    var width = this.props.width ? this.props.width : 'auto';
    var height = this.props.height ? this.props.height : 'auto';
    var alertStyle;
    var content;
    var containerStyle;
    if(this.state.active){
      content = this.props.content;
      bgStyle = {
        'opacity' : 1.0,
        'pointerEvents' : 'auto'
      };
      containerStyle = {
        'width':width,
        'height':height
      };
      alertStyle= {
        'pointerEvents' : 'auto'
      };
    }
    else{
      bgStyle = {
        'opacity' : 0.0,
        'pointerEvents' : 'none'
      };
      containerStyle = {
        'display':'none',
      };
      alertStyle= {
        'pointerEvents' : 'none'
      };
    }

    return (
      <div className="FullscreenAlert alert" style={alertStyle}>
        <div className="alert-background" onClick={this.handleBackgroundClick} style={bgStyle} />
        <div className="alert-content-container" style={containerStyle} >
          { content }
        </div>
      </div>
    );
  }
};

FullscreenAlert.propTypes = {
  content: React.PropTypes.element.isRequired,
  onClose: React.PropTypes.func.isRequired,
  active: React.PropTypes.bool.isRequired,
  contentWidth: React.PropTypes.string,
  contentHeight: React.PropTypes.string
};

export default FullscreenAlert;
