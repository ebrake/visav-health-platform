import React from 'react';
import Layout from './layouts/Layout';
import Header from './modules/Header';
import Body from './modules/Body';
import Footer from './modules/Footer';

export default function HealthEventNotificationEmail(props) {
  const { healthEventEmail } = props;
  const { doctor, patient, healthEvent } = healthEventEmail;
  const { exercise } = healthEvent;
  var whilePerformingExerciseString;
  var noteString;
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
          <p>{patient.firstName} experienced an adverse health event ({healthEvent.type}){whilePerformingExerciseString}.</p>
          <p>
            In {patient.firstName}&rsquo;s estimation, they experienced {healthEvent.type} with an intensity of {healthEvent.intensity}.
            They feel that the intensity is {healthEvent.perceivedTrend}.
          </p>
        </div>
        <div className="actions">
          <button className="btn-take-action">Take action now!</button>
          <button className="btn-dismiss">Dismiss notification</button>
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
      lastName: 'Malaise'
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
