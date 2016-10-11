import React from 'react';
import Layout from './layouts/Layout';
import VisavHeader from './modules/VisavHeader';
import Body from './modules/Body';
import colors from '../utils/colors';
import Footer from './modules/Footer';

export default function HealthEventNotificationEmail(props) {
  const { healthEventMessage, doctor, patient, /*healthEvent, exercise*/ } = props;

  const buttonStyle = {
    outline: 'none',
    border: 'none',
    display: 'inline-block',
    margin: '10px ',
    width: '40%',
    height: '50px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '15px',
    fontStyle: 'bold',
    float: 'middle',
    backgroundColor: colors.getColor('red'),
    WebkitAppearance: 'none !important',
    WebkitBorderRadius: 0
  };
  const actionsStyle = {
    margin: '20px 0 0 0',
  };
  //var whilePerformingExerciseString;
  //var pronoun;
  //var feelsString;
  var takeActionURL = process.env.API_ROOT + 'api/healthEventMessages/takeAction/';
  var dismissURL = process.env.API_ROOT + 'api/healthEventMessages/dismiss/';

  /*
  if (patient.gender === 'male') {
    pronoun = <span>he</span>;
    feelsString = <span>He feels</span>;
  }
  else if (patient.gender === 'female') {
    pronoun = <span>she</span>;
    feelsString = <span>She feels</span>;
  }
  else{
    pronoun = <span>they</span>;
    feelsString = <span>They feel</span>;
  }


  if (healthEvent.exercise) {
    whilePerformingExerciseString = <span> after performing {exercise.type.toLowerCase()}</span>;
  } else {
    whilePerformingExerciseString = null;
  }
  */

  return (
    <Layout>
      <VisavHeader />

      <Body>
        <h2 className="title">Dr. {doctor.lastName}, you have 1 new notification</h2>
        <div className="health-event-info">
          <p>from {patient.firstName} {patient.lastName} regarding their therapy.</p>
        </div>
        <div style={actionsStyle} className="actions">
          <form action={takeActionURL} method="get">
            <input type="hidden" name="healthEventMessageId" value={healthEventMessage.id} />
            <input style={buttonStyle} type="submit" value="View now" />
          </form>
          <form action={dismissURL} method="get">
            <input type="hidden" name="healthEventMessageId" value={healthEventMessage.id} />
            <input style={buttonStyle} type="submit" value="Remind me later" />
          </form>
        </div>
      </Body>

      <Footer />
    </Layout>
  );

}

HealthEventNotificationEmail.defaultProps = { 
  doctor: {
    firstName: 'Doc',
    lastName: 'Halliday'
  },
  patient: {
    firstName: 'Pat',
    lastName: 'Malaise',
    gender: 'other'
  },
  healthEventMessage: {
    id: 12315412
  },
  healthEvent: {
    intensity: 7,
    perceivedTrend: 'increasing',
    type: 'swelling'
  },
  exercise: null
};
