import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'

class ImageButton extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isMousedOver: false
    };
    this.setImageUrl = this.setImageUrl.bind(this);
    this.mouseDidEnter = this.mouseDidEnter.bind(this);
    this.mouseDidLeave = this.mouseDidLeave.bind(this);
  }

  setImageUrl( isMousedOver, isSelected ){
    var finalUrl;
    self = this;
    if( this.props.imgUrl )
    {
      var imageName = this.props.imgUrl.split('.')[0];
      var imageExtension = this.props.imgUrl.split('.')[1];

      if( isSelected && !this.props.disableSelectedImage) {
        var selectedAssembledUrl = 'src/img/' + imageName + '-selected.' + imageExtension;
        if(this.doesImageExistsAtUrl(selectedAssembledUrl)){
          //if it's selected and there exists a selected image, 
          //override everything below and return selected image
          self.setState({ imageUrl: selectedAssembledUrl });
          return;
        }
      }
      
      if( isMousedOver && !this.props.disableHoverImage){
        var hoverAssembledUrl = 'src/img/' + imageName + '-hover.' + imageExtension;
        if(this.doesImageExistsAtUrl(hoverAssembledUrl)){
          //if it's moused over and there exists a hover image, 
          //override everything below and return hover image
          self.setState({ imageUrl: hoverAssembledUrl });
          return;
        }
      }

      //if nothing else was found, we use the default url;
      var defaultAssembledUrl = 'src/img/' + this.props.imgUrl;
      this.setState({ imageUrl: defaultAssembledUrl });
      return;
    }
  }

  doesImageExistsAtUrl(imgUrl){

    var http = new XMLHttpRequest();
    http.open('HEAD', imgUrl, false);
    http.send();
    return http.status != 404;
  }

  componentDidMount(){

  }

  componentWillReceiveProps(newProps) {

    this.setImageUrl(false, newProps.selected);
    
  }

  mouseDidEnter(){
    this.setImageUrl(true, this.props.selected);

  }

  mouseDidLeave(){
    this.setImageUrl(false, this.props.selected);
  }

  render() {

    let textContentStyle = this.props.text?null:
    {
      display: 'none'
    };

    var imageContentStyle = this.state.imageUrl?
    {
      backgroundImage: 'url(\'' + this.state.imageUrl + '\''
    } 
    :{
      display: 'none'
    };

    let classNames = this.props.className?
    'ImageButton ' + this.props.className:
    'ImageButton';
    
    return (
      <button onClick={this.props.onClick} className={classNames} onMouseEnter={this.mouseDidEnter} onMouseLeave={this.mouseDidLeave}>
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
  imgUrl: React.PropTypes.string,
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
  selected: React.PropTypes.bool,
  disableHoverImage: React.PropTypes.bool,
  disableSelectedImage: React.PropTypes.bool
};

export default ImageButton;

