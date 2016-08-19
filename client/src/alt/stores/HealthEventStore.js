import alt from '../alt';
import HealthEventActions from '../actions/HealthEventActions';

class HealthEventStore {
  constructor() {
    this.healthEvents = [];

    this.bindListeners({
      handleGetHealthEvents: HealthEventActions.GET_HEALTH_EVENTS
    });
  }

  handleGetHealthEvents(healthEvents) {
    this.healthEvents = healthEvents;
  }
}

export default alt.createStore(HealthEventStore, 'HealthEventStore');