import React from 'react';
import Layout from './layouts/Layout';
import Header from './modules/Header';
import Body from './modules/Body';
import Footer from './modules/Footer';

export default function HealthEventNotificationEmail(props) {
  const { healthEventEmail, doctor, patient, healthEvent, exercise } = props;

  const buttonStyle = {
    margin:'0 10px'
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
    whilePerformingExerciseString = <span> after performing {exercise.type}</span>;
  } else {
    whilePerformingExerciseString = null;
  }

  return (
    <Layout>
      <Header color="#134ac0" />

      <Body>
        <h2 className="title">{patient.firstName} {patient.lastName} had an adverse health event!</h2>
        <div className="health-event-info">
          <p>{patient.firstName} experienced an adverse health event ({healthEvent.type}){whilePerformingExerciseString}. In {patient.firstName}&rsquo;s estimation, {pronoun} experienced {healthEvent.type} with an intensity of {healthEvent.intensity}/10.</p>
          <p>{feelsString} that the intensity is {healthEvent.perceivedTrend}.</p>
        </div>
        <div style={actionsStyle} className="actions">
          <form style={buttonStyle} action={takeActionURL} method="get">
            <input type="hidden" name="healthEventEmailId" value={healthEventEmail.id} />
            <input type="submit" value="Take action now!" />
          </form>
          <form style={buttonStyle} action={dismissURL} method="get">
            <input type="hidden" name="healthEventEmailId" value={healthEventEmail.id} />
            <input type="submit" value="Dismiss notification" />
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
  exercise: {
    type: 'knee raises'
  }
};
