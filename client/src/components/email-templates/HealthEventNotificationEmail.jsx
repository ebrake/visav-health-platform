import React from 'react';
import Layout from './layouts/Layout';
import Header from './modules/Header';
import Body from './modules/Body';
import Footer from './modules/Footer';

export default function HealthEventNotificationEmail(props) {
  const { healthEventEmail, doctor, patient, healthEvent, exercise } = props;

  const buttonStyle = {
    outline: 'none',
    border: 'none',
    display: 'inline-block',
    margin: '10px auto',
    clear: 'both',
    width: '65%',
    height: '50px',
    cursor: 'pointer',
    color: '#444444',
    fontSize: '15px',
    fontStyle: 'bold',
  };
  const actionsStyle = {
    margin: '20px 0 0 0'
  };
  var whilePerformingExerciseString;
  var noteString;
  var pronoun;
  var feelsString;
  var takeActionURL = process.env.API_ROOT + 'api/healthEventEmails/takeAction/';
  var dismissURL = process.env.API_ROOT + 'api/healthEventEmails/dismiss/';

  if (patient.gender == 'male') {
    pronoun = <span>he</span>;
    feelsString = <span>He feels</span>;
  }
  else if (patient.gender == 'female') {
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

  return (
    <Layout>
      <Header color="#134ac0" />

      <Body>
        <h2 className="title">You have 1 new notification</h2>
        <div className="health-event-info">
          <p>from {patient.firstName} {patient.lastName} regarding their therapy.</p>
        </div>
        <div style={actionsStyle} className="actions">
          <form action={takeActionURL} method="get">
            <input type="hidden" name="healthEventEmailId" value={healthEventEmail.id} />
            <input style={buttonStyle} type="submit" value="View now" />
          </form>
          <form action={dismissURL} method="get">
            <input type="hidden" name="healthEventEmailId" value={healthEventEmail.id} />
            <input style={buttonStyle} type="submit" value="Remind me later" />
          </form>
        </div>
      </Body>

      <Footer color="#134ac0" />
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
  healthEventEmail: {
    id: 12315412
  },
  healthEvent: {
    intensity: 7,
    perceivedTrend: 'increasing',
    type: 'swelling'
  },
  exercise: null
};
