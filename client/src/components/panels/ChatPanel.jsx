import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'alt-utils/lib/connectToStores';
import moment from 'moment';
import TelesessionStore from '../../alt/stores/TelesessionStore';
import TelesessionActions from '../../alt/actions/TelesessionActions';

class ChatPanel extends React.Component {

  static getStores() {
    return [TelesessionStore];
  }

  static getPropsFromStores() {
    return TelesessionStore.getState();
  }

  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
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
      <div className="ChatPanel panel">
        <div className="ChatMessageBox">
          <textarea className="ChatInputBox" ref="chatTextRef" onKeyPress={this.handleKeyPress} placeholder="Type your message. Press shift + Enter to send" />
          {Rows}
        </div>
      </div>
    );
  }
};

export default connectToStores(ChatPanel);
