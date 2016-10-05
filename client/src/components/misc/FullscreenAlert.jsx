import React from 'react';

class FullscreenAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    }

    this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.active !== this.props.active) {
      this.setState({ active: newProps.active });
    }
  }

  handleBackgroundClick(event){
    console.log(event);
    this.props.onClickOutside();
  }

  render() {
    var alertStyle;
    var bgStyle;
    var content;

    if (this.state.active) {
      content = this.props.content;
      bgStyle = {
        'opacity' : 0.8,
        'pointerEvents' : 'auto'
      };
      alertStyle= {
        'pointerEvents' : 'auto'
      };
    }
    else {
      bgStyle = {
        'opacity' : 0.0,
        'pointerEvents' : 'none'
      };
      alertStyle= {
        'pointerEvents' : 'none'
      };
    }

    return (
      <div className="FullscreenAlert alert" style={alertStyle}>
        <div className="alert-background" onClick={this.handleBackgroundClick} style={bgStyle} />
        { content }
      </div>
    );
  }
};

FullscreenAlert.propTypes = {
  content: React.PropTypes.element.isRequired,
  onClickOutside: React.PropTypes.func.isRequired,
  active: React.PropTypes.bool.isRequired,
};

export default FullscreenAlert;
