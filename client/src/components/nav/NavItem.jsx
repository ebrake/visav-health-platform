import React, { Component } from 'react';
import { hashHistory } from 'react-router';

var NavItem = React.createClass({
  propTypes: {
    imgSrc: React.PropTypes.string,
    path: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
  },
  mixins: null,
  cursors: {
    list: ['list']
  },
  getInitialState() {
    return {

    };
  },
  handleClick(){
    if (this.props.path) {
      hashHistory.push(this.props.path);
    }
    else { 
      hashHistory.push('/'+this.props.title);
    }
  },
  render: function () {
    return (
      <div className="NavItem" onClick={this.handleClick}>
        { this.props.imgSrc ? 
          <div className="img-container">
            <img src={this.props.imgSrc} /> 
          </div>
        : 
        null }
        <span>{this.props.title}</span>
      </div>
    );
  }
});

export default NavItem;

