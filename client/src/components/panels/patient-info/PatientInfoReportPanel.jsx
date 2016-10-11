import React from 'react';
import ImageButton from '../../buttons/ImageButton';
import FullscreenAlert from '../../misc/FullscreenAlert';
import PGRResponsePanel from './PGRResponsePanel';
import NotificationActions from '../../../alt/actions/NotificationActions';

class PatientInfoReportPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      title: '',
      message: ''
    }

    this.hideAlert = this.hideAlert.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.handleHideAlert = this.handleHideAlert.bind(this);
    this.handleRequestReport = this.handleRequestReport.bind(this);
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  handleRequestReport(event) {
    if (this.props.patient) {
      NotificationActions.requestPatientGeneratedReport(this.props.patient.id)
      .then(function(response){
        var title = response.data.status.slice(0, 1).toUpperCase()+response.data.status.slice(1);

        var message;
        if (response.data.status === 'success') 
          message = 'The patient has been notified of the request to generate a report.';
        else 
          message = response.data.message;

        this.showAlert(title, message);
      }.bind(this))
    }
  }

  //stupid es-lint
  handleHideAlert(event){
    this.hideAlert(event);
  }

  hideAlert(event) {
    this.setState({
      showAlert: false
    })
  }

  showAlert(title, message) {
    this.setState({
      showAlert: true,
      title: title,
      message: message
    })
  }

  render() {
    var fromString = '';
    if (this.props.patient && this.props.patient.fullName)
      fromString = " from "+this.props.patient.fullName;
    else if (this.props.patient.firstName && this.props.patient.lastName)
      fromString = " from "+this.props.patient.firstName+" "+this.props.patient.lastName;

    return (
      <div className="PatientInfoReportPanel panel">
        <h2 className="title">Reports</h2>
        <FullscreenAlert active={this.state.showAlert} onClickOutside={this.handleHideAlert} content={<PGRResponsePanel title={this.state.title} message={this.state.message} hideAlert={this.hideAlert} />} />
        <ImageButton text={"Request a Report"+fromString} onClick={this.handleRequestReport} />
      </div>
    );
  }
};

PatientInfoReportPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoReportPanel;

