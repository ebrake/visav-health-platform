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
        <img src={this.props.imgSrc} />
        <span>{this.props.title}</span>
      </div>
    );
  }
});

export default NavItem;

