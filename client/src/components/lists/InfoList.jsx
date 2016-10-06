import React from 'react';

class InfoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var listItems = [];

    for(var key in this.props.infoDict){
      if (this.props.infoDict.hasOwnProperty(key)) {
        let value = this.props.infoDict[key];
        let element =
          <li key={ key }>
            <span>{ key }:</span><span>{value}</span>
          </li>;

        listItems.push(element);
      }
    }
    return (
      <div className="InfoList">
        <ul>
          { listItems }
        </ul>
      </div>
    );
  }
};

InfoList.propTypes = {
  infoDict: React.PropTypes.object
};

export default InfoList;