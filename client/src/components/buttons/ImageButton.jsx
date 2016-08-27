import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'

class ImageButton extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {

    };
    this.setImageUrl = this.setImageUrl.bind(this);

  }

  setImageUrl( selected ){
    var finalUrl;
    self = this;
    if( this.props.imgUrl )
    {
      var imageName = this.props.imgUrl.split('.')[0];
      var imageExtension = this.props.imgUrl.split('.')[1];
      var defaultAssembledUrl = 'src/img/' + this.props.imgUrl;
 
      if( selected ) {
        var selectedAssembledUrl = 'src/img/' + imageName + '-selected.' + imageExtension;
        if(this.doesImageExistsAtUrl(selectedAssembledUrl)){
          console.log('IMAGE EXISTS');
          self.setState({ imageUrl: selectedAssembledUrl });
        }
        else{
          self.setState({ imageUrl: defaultAssembledUrl });
        }
      }
      else{
        this.setState({ imageUrl: defaultAssembledUrl });
      }
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

    this.setImageUrl(newProps.selected);
    
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
  imgUrl: React.PropTypes.string,
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
  selected: React.PropTypes.bool
};

export default ImageButton;

