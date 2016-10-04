import alt from '../alt';
import HealthEventActions from '../actions/HealthEventActions';

class HealthEventStore {
  constructor() {
    this.healthEvents = [];

    this.bindListeners({
      handleGetHealthEvents: HealthEventActions.GET_HEALTH_EVENTS,
      handleDataUpdated: HealthEventActions.DATA_UPDATED
    });
  }

  handleGetHealthEvents(healthEvents) {
    this.healthEvents = healthEvents;
  }

  handleDataUpdated(date) {
    this.dataUpdated = date;
  }
  
}

export default alt.createStore(HealthEventStore, 'HealthEventStore');