import alt from '../alt'

class LiveMessagingActions {

  receivedDataUpdate(messageObj){
    
    console.log("LiveMessagingActions: Received dataUpdate");
    return messageObj;

  }

}

export default alt.createActions(LiveMessagingActions);
