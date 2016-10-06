import React from 'react';

import ImageButton from '../../buttons/ImageButton';

class PGRResponsePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    
  }

  handleClick(event) {
    this.props.hideAlert(event);
  }

  render() {
    return (
      <div className="PGRResponsePanel panel fullscreen-alert">
        <span className="title">{this.props.title}</span>
        <span className="description">{this.props.message}</span>
        <ImageButton text="Okay" onClick={ this.handleClick } />
      </div>
    );
  }
};

PGRResponsePanel.propTypes = {
  title: React.PropTypes.string,
  message: React.PropTypes.string,
  hideAlert: React.PropTypes.func,
};

export default PGRResponsePanel;
