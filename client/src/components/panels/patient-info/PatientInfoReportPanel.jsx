import React from 'react';

class PatientInfoReportPanel extends React.Component {
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
      <div className="PatientInfoReportPanel panel">
        <h2 className="title">Reports</h2>
      </div>
    );
  }
};

PatientInfoReportPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoReportPanel;

