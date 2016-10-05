import React from 'react';

class VideoFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        display: 'block'
      },
      message: 'Initiate the video with the button on the right.'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data || JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      update(nextProps.data);
    }
  }

  update(data) {
    if (!data) {
      this.setState({
        style: {
          display: 'block'
        }
      });
    }
  }

  render () {
    return (
      <div className="video-feedback" style={this.state.style}>
        <span className="feedback-message">{this.state.message}</span>
      </div>
    );
  }
};

VideoFeedback.propTypes = {
  data: React.PropTypes.object
}

export default VideoFeedback;
