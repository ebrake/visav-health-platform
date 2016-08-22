import React, { Component } from 'react';

class VisavList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: []
    };

    this.updateList = this.updateList.bind(this);
  }

  componentDidMount(){
    this.updateList();
  }

  componentWillUnmount(){
    
  }

  componentWillReceiveProps(nextProps){
    this.updateList();
  }

  updateList(){
    let rows = [];
    for (var attr in this.props.data) {
      rows.push({ key: attr, value: this.props.data[attr] });
    }
    this.setState({
      rows: rows
    });
  }

  render() {
    return (
      <div className="visav-list-container">
        <div className="items">
          { 
            this.state.rows.map((row, index) => {
              return (
                <div className="item" key={index}>
                  <div className="key">{row.key}</div>
                  <div className="value">{row.value}</div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
};

export default VisavList;
