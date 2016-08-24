import React from 'react';
import Layout from './layouts/Layout';
import Header from './modules/Header';
import Body from './modules/Body';
import Footer from './modules/Footer';

export default function HealthEventNotificationEmail(props) {
  const { healthEventEmail } = props;
  const { doctor, patient, healthEvent } = healthEventEmail;
  const { exercise } = healthEvent;
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
  }
  else{
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
          <button style={buttonStyle} className="btn-take-action">Take action now!</button>
          <button style={buttonStyle} className="btn-dismiss">Dismiss notification</button>
        </div>
      </Body>

      <Footer color="#134ac0" />
    </Layout>
  );

}

HealthEventNotificationEmail.defaultProps = { 
  healthEventEmail: {
    doctor: {
      firstName: 'Doc',
      lastName: 'Halliday'
    },
    patient: {
      firstName: 'Pat',
      lastName: 'Malaise',
      gender: 'other'
    },
    healthEvent: {
      intensity: 7,
      perceivedTrend: 'increasing',
      type: 'swelling',
      exercise: {
        type: 'knee raises'
      }
    },
  } 
};
