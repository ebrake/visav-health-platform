import alt from '../alt'
import RoutingActions from '../actions/RoutingActions';

let defaultAfterLoginRoute = {
  path: '/me',
  query: ''
}

class RoutingStore {
  constructor() {
    this.afterLoginRoute = Object.assign({}, defaultAfterLoginRoute);

    this.bindListeners({
      handleSetAfterLoginRoute: RoutingActions.SET_AFTER_LOGIN_ROUTE,
    });

    this.exportPublicMethods({
      getAfterLoginRoute: this.getAfterLoginRoute
    })
  }

  /* ACTION HANDLERS */
  handleSetAfterLoginRoute(nextState) {
    if (nextState.location && nextState.location.pathname) {
      this.afterLoginRoute = {
        path: nextState.location.pathname,
        query: nextState.location.search || ''
      }
    }
  }

  /* PUBLIC METHODS */
  getAfterLoginRoute() {
    return this.state.afterLoginRoute;
  }
}

export default alt.createStore(RoutingStore, 'RoutingStore');