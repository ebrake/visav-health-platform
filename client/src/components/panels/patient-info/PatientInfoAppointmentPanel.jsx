import React from 'react';

class PatientInfoAppointmentPanel extends React.Component {
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
      <div className="PatientInfoAppointmentPanel panel">
        <h2 className="title">Next Appointment</h2>
      </div>
    );
  }
};

PatientInfoAppointmentPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoAppointmentPanel;

