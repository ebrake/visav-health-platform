import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'

class ImageButton extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    let textContentStyle = this.props.text?null:
    {
      display: 'none'
    };

    let imageContentStyle = this.props.imgURL?
    {
      backgroundImage: 'url(\'src/img/' + this.props.imgURL + '\')'
    }:
    {
      display: none
    };

    let classNames = this.props.className?
    'ImageButton ' + this.props.className:
    'ImageButton';
    
    return (
      <button onClick={this.props.onClick} className={classNames}>
        <span>
          <div className="btn-image-content" style={imageContentStyle}/>
          <div className="btn-text-content" style={textContentStyle}>
            {this.props.text}
          </div>
        </span>
      </button>
    );
  }
};

ImageButton.propTypes = {
  text: React.PropTypes.string,
  imgURL: React.PropTypes.string,
  onClick: React.PropTypes.func,
  className: React.PropTypes.string
};

export default ImageButton;

