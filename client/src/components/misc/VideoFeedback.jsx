import React from 'react';
import colors from '../utils/colors';

var messages = {
  initial: 'Initiate the video with the button on the right.',
  calling: 'Contacting the patient, please wait.',
  noAnswer: 'The patient did not pick up the call. Please try again.',
  noInstall: 'The patient has not installed the app. An email has been sent to them with instructions on how to install. Please try again once they have installed the app.',
  callEnded: 'The call has ended. Use the button on the right to initiate a new video call.'
};

var delayBeforeNoAnswerMessageDisplays = 60 * 1000;

class VideoFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'block',
      mode: 'initial',
      message: 'Initiate the video with the button on the right.',
      isError: false
    };

    this.update = this.update.bind(this);
    this.animateCallingMessage = this.animateCallingMessage.bind(this);
    this.displayNoAnswerMessage = this.displayNoAnswerMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data || JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.update(nextProps.data);
    }
  }

  displayNoAnswerMessage() {
    if (this.state.mode === 'calling') {
      this.setState({
        display: 'block',
        message: messages['noAnswer'],
        isError: false
      })
    }
  }

  animateCallingMessage(delay, numPeriods) {
    console.log('Animating...');
    numPeriods = numPeriods || 0;
    delay -= 1000;

    if (delay <= 0) {
      return this.displayNoAnswerMessage();
    }
    else if (this.state.mode === 'calling') {
      var i = 0;
      numPeriods = (numPeriods + 1) % 4;
      let newMessage = messages['calling'];

      while (i < 3) {
        newMessage += (i < numPeriods ? '.' : '\u00a0');
        i++;
      }

      this.setState({
        message: newMessage
      })

      console.log('dispatching new animate...');
      setTimeout(this.animateCallingMessage, 1000, delay, numPeriods);
    }
  }

  update(data) {
    let newState = {
      display: false,
      message: '',
      isError: false,
      mode: 'hidden'
    }

    if (!data || data.mode === 'hidden') {
      this.setState(newState);
      return;
    }

    newState.mode = data.mode;
    newState.display = true;

    if (data.mode === 'initial' || data.mode === 'callEnded') {
      newState.message = messages[data.mode];
    }
    else if (data.mode === 'calling') {
      newState.message = messages['calling']+'\u00a0\u00a0\u00a0';
      setTimeout(this.animateCallingMessage, 1000, delayBeforeNoAnswerMessageDisplays);
      console.log('Hm');
      console.dir(newState);
    }
    else if (data.mode === 'error') {
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
