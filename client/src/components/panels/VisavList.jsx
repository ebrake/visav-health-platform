import React, { Component } from 'react';

class VisavList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Details',
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
      if (attr != 'title')
        rows.push({ key: attr, value: this.props.data[attr] });
    }
    this.setState({
      title: this.props.data.title,
      rows: rows
    });
  }

  render() {
    return (
      <div className="visav-list-container">
        <div className="vavl-title">{this.state.title}</div>
        <div className="visav-list">
          <div className="vavl-left-column">
          { 
            this.state.rows.map((row, index) => {
              return (
                <div className="item" key={index}>
                  <div className="key">{row.key}</div>
                </div>
              );
            })
          }
          </div>
          <div className="vavl-right-column">
          { 
            this.state.rows.map((row, index) => {
              return (
                <div className="item" key={index}>
                  <div className="value">{row.value}</div>
                </div>
              );
            })
          }
          </div>
        </div>
      </div>
    );
  }
};

export default VisavList;
