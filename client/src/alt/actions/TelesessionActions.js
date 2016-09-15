import alt from '../alt'

/** Telesession Actions */
class TelesessionActions {

  /**
   * Get a session ID to use to connect to OpenTok
  */
  createSession(){
    return function (dispatch) {
      return  fetch(
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
        return dispatch(response);

      })
      .catch((err) => {
        return dispatch(err);
      });
    }
  }

  /**
   * Receive a chat action (Fire when you receives a signal)
   * @param {Object} event OpenTok Signal Event object
  */
  receivedChat(event){
    return event;
  }

  /**
   * Send a message action
   * @param {string} message Message text
  */
  sendChat(message){
    return message;
  }

  /**
   * After you connect, save the active session to the store
   * @param {Object} session - Initialized OpenTok session
  */
  setActiveSession(session){
    return session;
  }

}

export default alt.createActions(TelesessionActions);
