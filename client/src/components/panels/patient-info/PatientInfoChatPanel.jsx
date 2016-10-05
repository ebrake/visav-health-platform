import React from 'react';

class PatientInfoChatPanel extends React.Component {
  //eslint-disable-next-line
  constructor(props) {
    super(props);
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render() {
    return (
      <div className="PatientInfoChatPanel panel">
        <h2 className="title">Chat</h2>
      </div>
    );
  }
};

PatientInfoChatPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoChatPanel;

