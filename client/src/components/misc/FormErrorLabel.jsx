import React, { Component } from 'react';

class FormErrorLabel extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    if (!this.props.text) return null;

    return (
      <div className="FormErrorLabel">
        <div className="FormErrorText">
          { this.props.text }
        </div>
      </div>
    );
  }
};

FormErrorLabel.propTypes = {
  text: React.PropTypes.string.isRequired
}

export default FormErrorLabel;
