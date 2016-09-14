import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import TelesessionStore from '../../alt/stores/TelesessionStore';
import TelesessionActions from '../../alt/actions/TelesessionActions';

class ChatPanel extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      chatEvents: null
    }

    let telesessionState = TelesessionStore.getState();
    this.telesessionChanged = this.telesessionChanged.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

  }

  telesessionChanged(telesessionState){

    this.setState({
      chatEvents: telesessionState.chatEvents
    });

  }
  componentDidMount(){
    TelesessionStore.listen(this.telesessionChanged);
  }

  componentWillUnmount(){
    TelesessionStore.unlisten(this.telesessionChanged);
  }

  sendMessage(message) {
    TelesessionActions.sendChat(message);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      var message = event.target.value;
      if (message === '') return;
      this.sendMessage(message); // Send message
      event.preventDefault(); // Prevent default action
      ReactDOM.findDOMNode(this.refs.chatTextRef).value=null; // Clear the textarea
    }
  }

  render() {

    let chatEvents = this.state.chatEvents;

    /**
     * Chat Row component
     * Loop through the list of chats and create array of Row components
    */
    var Rows = "";
    if (chatEvents) {
      Rows = chatEvents.map(function(event) {
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
      <div className="ChatPanel panel">
        <div className="ChatMessageBox">
          {Rows}
          <textarea className="ChatInputBox" ref="chatTextRef" onKeyPress={this.handleKeyPress} placeholder="Type your message. Press shift + Enter to send" />
        </div>
      </div>
    );
  }
};

export default ChatPanel;
