import React from 'react';
import colors from '../utils/colors';

var messages = {
  initial: 'Initiate the video with the button on the right.',
  calling: 'Contacting the patient, please wait...',
  noAnswer: 'The patient did not pick up the call. Please try again.',
  noInstall: 'The patient has not installed the app. An email has been sent to them with instructions on how to install. Please try again once they have installed the app.'
}

class VideoFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'block',
      message: 'Initiate the video with the button on the right.',
      isError: false
    };

    this.update = this.update.bind(this);
    this.displayNoAnswerMessage = this.displayNoAnswerMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data || JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.update(nextProps.data);
    }
  }

  displayNoAnswerMessage() {
    if (this.state.message === messages['calling']) {
      this.setState({
        display: 'block',
        message: messages['noAnswer'],
        isError: false
      })
    }
  }

  update(data) {
    let newState = {
      display: false,
      message: '',
      isError: false,
    }

    if (!data) {
      //do nothing
    }
    else if (data.mode === 'initial') {
      newState.display = true;
      newState.message = messages['initial'];
    }
    else if (data.mode === 'hidden') {
      newState.display = false;
    }
    else if (data.mode === 'calling') {
      newState.display = true;
      newState.message = messages['calling'];
      setTimeout(this.displayNoAnswerMessage, 15000);
    }
    else if (data.mode === 'error') {
      newState.display = true;
      newState.isError = true;
      newState.message = (data.error && data.error.statusCode === 404) ? messages['noInstall'] : data.message;
    }

    this.setState(newState);
  }

  render () {
    var display = this.state.display ? 'block' : 'none';
    var color = this.state.isError ? colors.getFontColor('red') : colors.getFontColor('blue');

    return (
      <div className="video-feedback" style={{ display: display }}>
        <span className="feedback-message" style={{ color: color }}>{this.state.message}</span>
      </div>
    );
  }
};

VideoFeedback.propTypes = {
  data: React.PropTypes.object
}

export default VideoFeedback;
