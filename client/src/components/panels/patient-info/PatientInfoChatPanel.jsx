import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'alt-utils/lib/connectToStores';
import moment from 'moment';
import TelesessionStore from '../../../alt/stores/TelesessionStore';
import TelesessionActions from '../../../alt/actions/TelesessionActions';
import VisavInput from '../../inputs/VisavInput';

class PatientInfoChatPanel extends Component {
 
  static getStores() {
    return [TelesessionStore];
  }

  static getPropsFromStores() {
    return TelesessionStore.getState();
  }

  constructor(props) {
    super(props);

    this.state = {
      draftMessage:''
    }

    this.chatInputDidChange = this.chatInputDidChange.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }

  sendMessage(message) {
    TelesessionActions.sendChat(message);
  }

  chatInputDidChange(event){
    this.setState({draftMessage: event.target.value});
  }

  enterPressed(event) {
    this.sendMessage(event.target.value);
    this.setState({draftMessage:''});
  }

  componentDidMount(){
    this.scrollMessagesToBottom();
  }

  componentWillUnmount(){

  }

  componentDidUpdate() {
    this.scrollMessagesToBottom();
  }

  scrollMessagesToBottom() {
    var node = ReactDOM.findDOMNode(this.refs.chatMessages);
    this.refs.chatMessages.scrollTop = node.scrollHeight;
  }

  render() {

    /**
     * Chat Row component
     * Loop through the list of chats and create array of Row components
    */
    var Rows = "";
    if (this.props.chatEvents) {
      Rows = this.props.chatEvents.map(function(event) {
        const data = JSON.parse(event.data);
        const dateString = moment(data.date).format('MMMM Do YYYY, h:mm:ss a');
        const chatRowClass = (event.fromMe ? 'ChatRowFromMe' : 'ChatRowToMe');
        return (
          <div className={chatRowClass} key={event.id}>
            <span className="ChatMessageHeader">
              <b>{data.email}</b> <span>{dateString}</span>
            </span><br/>
            {data.message}
          </div>
        )
      });
    }
    
    return (
      <div className="PatientInfoChatPanel panel">
        
        <h2 className="title">Chat</h2>

        <div className="ChatContainer">
          <div ref="chatMessages" className="ChatMessages">
            {Rows}
          </div>
          <div className="ChatInput">
            <VisavInput clearOnEnter={true} enterPressed={ this.enterPressed } label="Type your message. Press Enter to send" value={this.state.draftMessage} valueDidChange={ this.chatInputDidChange } />
          </div>
        </div>

      </div>
    );
  }
};

PatientInfoChatPanel.propTypes = {
  patient: React.PropTypes.object
};

export default connectToStores(PatientInfoChatPanel);

