import React, { Component } from 'react';

var NavItem = React.createClass({
  propTypes: {
    imgSrc: React.PropTypes.string,
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
  render: function () {
    return (
      <div className="NavItem">
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

