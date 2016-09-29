import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class VisavIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  visavIconFontCharacter() {

  }

  icon() {
    var content;
    if (this.props.type === 'start-telesession') {
      content = <FontAwesome name='users' />
    }
    else if (this.props.type === 'call-patient') {
      content = <FontAwesome name='phone' />
    }
    else if (this.props.type === 'hang-up') {
      content = <FontAwesome name='cancel' />
    }
    else if (this.props.type === 'muted-self') {
      content = <FontAwesome name='microphone-slash' />
    }
    else if (this.props.type === 'unmuted-self') {
      content = <FontAwesome name='microphone' />
    }
    else if (this.props.type === 'muted-subscriber') {
      content = <FontAwesome name='volume-off' />
    }
    else if (this.props.type === 'unmuted-subscriver') {
      content = <FontAwesome name='volume-up' />
    }
    else if (this.props.type === 'general-patient-info') {
      content = <FontAwesome name='user' />
    }
    else if (this.props.type === 'next-appointment') {
      content = <FontAwesome name='calendar' />
    }
    else if (this.props.type === 'medications') {
      content = <FontAwesome name='medkit' />
    }
    else if (this.props.type === 'exercises') {
      content = <FontAwesome name='bicycle' />
    }
    else if (this.props.type === 'reports') {
      content = <FontAwesome name='clipboard' />
    }
    else if (this.props.type === 'chat') {
      content = <FontAwesome name='comments' />
    }
    else if (this.props.type === 'telesession') {
      content = <FontAwesome name="user-md" />
    }
    else if (this.props.type === 'organization') {
      content = <FontAwesome name='sitemap' />
    }
    else if (this.props.type === 'invite') {
      content = <FontAwesome name='user-plus' />
    }
    else if (this.props.type === 'account-settings') {
      content = <FontAwesome name='cog' />
    }
    else if (this.props.type === 'logout' ) {
      content = <FontAwesome name='sign-out' />
    }
    return content;
  }


  render () {
    var classNames = this.props.type + ' VisavIcon';
    return (
      <div className={ classNames } onClick={this.props.onClick} >
        { this.icon() }
      </div>
    );
  }
};

VisavIcon.propTypes = {
  type: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func
};

export default VisavIcon;
