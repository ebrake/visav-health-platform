import alt from '../alt'

class LiveMessagingActions {

  receivedMessage(topic,message,packet){
    
    console.log("Received message... %s from channel ... %s",message.toString(),topic.toString());
    
    return {
      topic:topic,
      message:message,
      packet:packet
    }

  }

}

export default alt.createActions(LiveMessagingActions);
