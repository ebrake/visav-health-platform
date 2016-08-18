import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'
import { config } from 'react-loopback';
import MainHeader from '../headers/MainHeader';
import RepsChartPanel from '../panels/RepsChartPanel';
import ExercisesChartPanel from '../panels/ExercisesChartPanel';
import HealthEventsChartPanel from '../panels/HealthEventsChartPanel';
import ExerciseActions from '../../alt/actions/ExerciseActions';
@scriptLoader(
  'https://static.opentok.com/v2/js/opentok.min.js'
)

class Telesession extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      createSessionResponse: '',
      opentokScriptLoaded: null
    };
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      this.setState({opentokScriptLoaded: isScriptLoadSucceed});
    }
  }

  createSession() {

    fetch(
      process.env.API_ROOT + 'api/Telesessions/createSession', 
      {
        method: 'POST', 
        headers: new Header({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({}) 
      }
    ).then(responseObject => responseObject.json())
    .then(response => {
      this.setState({
        createSessionResponse: response
      });
      this.connectToSession();
      console.log(response);
    })
    .catch((err) => {
      this.setState({
        createSessionResponse: err
      });
      console.error(err);
    });
  }

  connectToSession() {

    const session = OT.initSession(config.get('OPENTOK_API_KEY'), this.state.createSessionResponse.session.sessionId);

    const publisher = OT.initPublisher(this.refs.tokboxContainer, {
      insertMode: 'replace',
      width: '100%',
      height: '100%'
    })

    session.connect(this.state.createSessionResponse.token, function (error) {
      if (!error) {
        session.publish(publisher);
      }
    });

  }

  render() {

    var jsLoaded;
    if (this.state.opentokScriptLoaded==null || this.state.opentokScriptLoaded==true) jsLoaded = null;
    else jsLoaded = <p><font color="red">Warning: Video cannot load due to a JavaScript error.</font></p>;

    return (
      <div className="Telesession">
        <MainHeader />
        <div className="telesession-container">
          <button onClick={this.createSession.bind(this)}><h1>Create Session</h1></button>
          {jsLoaded}
          <div className="videoContainer">
            <section ref="tokboxContainer" />
          </div>
        </div>
        <div className="charts-container">
          <RepsChartPanel />
          <ExercisesChartPanel />
          <HealthEventsChartPanel />
        </div>
      </div>
    );
  }
}

export default Telesession;
