import React from 'react';
import ImageButton from '../buttons/ImageButton';

class UnderConstructionPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmation : '',
      password : ''
    };


  }

  componentDidMount(){
  }

  componentWillUnmount(){
  }

  componentDidUpdate(){

  }


  render() {
    return (
      <div className="UnderConstructionPanel panel">
        <h1 className="title">{ 'Under Construction' }</h1>
        <p>
          {'This feature is under construction. It fulfills a function that we need access to, but has not yet been properly styled or had UX concerns addressed.'}
        </p>
        <p>
          {'We apologize for any non-intuitive use cases.'}
        </p>
        <ImageButton text='Close' onClick={ this.props.onClose } />
      </div>
    );
  }
};

UnderConstructionPanel.propTypes = {
  onClose: React.PropTypes.func.isRequired
}


export default UnderConstructionPanel;
