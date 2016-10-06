import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import InfoList from '../../lists/InfoList'

class PatientInfoMedicationPanel extends Component {
  
  constructor(props) {
    super(props);

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render() {
    var advairInfoDict = {
      'Name': 'Advair HFA 115/21',
      'Generic Name': 'FLUTICASONE PROPIONATE 115ug, SALMETEROL XINAFOATE 21ug',
      'Dosage': '2 doses twice/day',
      'Dosage Form': 'aerosol inhalation, metered',
      'Type': 'Corticosteroid/Bronchodilator combination'
    };

    var aeriusInfoDict = {
      'Name': 'Aerius 5mg',
      'Generic Name': 'DESLORATADINE 5mg',
      'Dosage': '1 dose once/day',
      'Dosage Form': 'tablet',
      'Type': 'Antihistamine, H1-receptor antagonist'
    };

    var xeljanzInfoDict = {
      'Name': 'Xeljanz XR 11mg',
      'Generic Name': 'TOFACITINIB CITRATE 11mg',
      'Dosage': '1 dose once/day',
      'Dosage Form': 'tablet',
      'Type': 'Rheumatoid Arthritis Relief'
    };

    var microzideInfoDict = {
      'Name': 'Microzide',
      'Generic Name': 'HYDROCHLOROTHIAZIDE 12.5mg',
      'Dosage': '1 dose once/day',
      'Dosage Form': 'capsule, gelatin coated',
      'Type': 'Thiazide Diuretic'
    };
    return (
      <div className="PatientInfoMedicationPanel panel">
        
        <h1 className="title">Medications</h1>

        <h2 className="subsection-title">Advair</h2>
        <InfoList infoDict={ advairInfoDict } />

        <h2 className="subsection-title">Aerius</h2>
        <InfoList infoDict={ aeriusInfoDict } />

        <h2 className="subsection-title">Microzide</h2>
        <InfoList infoDict={ microzideInfoDict } />

        <h2 className="subsection-title">Xeljanz</h2>
        <InfoList infoDict={ xeljanzInfoDict } />

      </div>
    );
  }
};

PatientInfoMedicationPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoMedicationPanel;

