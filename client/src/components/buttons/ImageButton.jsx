import React from 'react';

class ImageButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null
    };
    this.imageUrl = this.imageUrl.bind(this);
    this.handleMouseDidEnter = this.handleMouseDidEnter.bind(this);
    this.handleMouseDidLeave = this.handleMouseDidLeave.bind(this);
  }

  imageUrl( isMousedOver, isSelected ){
    if (this.props.imgUrl) {
      var imageName = this.props.imgUrl.split('.')[0];
      var imageExtension = this.props.imgUrl.split('.')[1];

      if (isSelected && !this.props.disableSelectedImage) {
        var selectedAssembledUrl = 'src/img/' + imageName + '-selected.' + imageExtension;
        if (this.doesImageExistsAtUrl(selectedAssembledUrl)) {
          //if it's selected and there exists a selected image, 
          //override everything below and return selected image
          return selectedAssembledUrl;
        }
      }
      
      if (isMousedOver && !this.props.disableHoverImage) {
        var hoverAssembledUrl = 'src/img/' + imageName + '-hover.' + imageExtension;
        if (this.doesImageExistsAtUrl(hoverAssembledUrl)) {
          //if it's moused over and there exists a hover image, 
          //override everything below and return hover image
          return hoverAssembledUrl;
        }
      }

      //if nothing else was found, we use the default url;
      var defaultAssembledUrl = 'src/img/' + this.props.imgUrl;
      return defaultAssembledUrl;
    }
  }

  doesImageExistsAtUrl(imgUrl){
    var http = new XMLHttpRequest();
    http.open('HEAD', imgUrl, true);
    http.send();
    //is http.status a number or a string? left this for that reason
    //eslint-disable-next-line
    return http.status != 404;
  }

  componentDidMount(){

  }

  componentWillReceiveProps(newProps) {

    this.setState({ imageUrl: this.imageUrl(false, newProps.selected) });

  }

  handleMouseDidEnter(){
    this.setState({ imageUrl: this.imageUrl(true, this.props.selected) });


  }

  handleMouseDidLeave(){
    this.setState({ imageUrl: this.imageUrl(false, this.props.selected) });

  }

  render() {

    let textContentStyle = this.props.text?null:
    {
      display: 'none'
    };

    var imageContentStyle;

    if(this.state.imageUrl){
      //this should be the case in 99% of the renders where an image was specified
      imageContentStyle = {
        backgroundImage: 'url(\'' + this.state.imageUrl + '\')'
      } 
    }
    else if (this.props.imgUrl) {
      //if it is first render and componentWillReceiveProps has not yet been fired
      if (this.props.selected) {
        imageContentStyle = {
          backgroundImage: 'url(\'' + this.imageUrl( false, true ) + '\')'
        }
      }
      else{
        imageContentStyle = {
          backgroundImage: 'url(\'' + this.imageUrl( false, false ) + '\')'
        }
      }
    }
    else{
      imageContentStyle = {
        display: 'none'
      };
    }
    

    let classNames = this.props.className?
    'ImageButton ' + this.props.className:
    'ImageButton';
    
    return (
      <div onClick={this.props.onClick} className={classNames} onMouseEnter={this.handleMouseDidEnter} onMouseLeave={this.handleMouseDidLeave}>
        <div className="btn-image-content" style={imageContentStyle}></div>
        <div className="btn-text-content" style={textContentStyle}>
          {this.props.text}
        </div>
      </div>
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

