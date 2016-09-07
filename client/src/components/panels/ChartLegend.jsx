import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import chartUtil from '../utils/chartUtil';

class ChartLegend extends React.Component {
  constructor(props) {
    super(props);

    this.state = { };

    this.injectLegend = this.injectLegend.bind(this);
  }

  componentDidMount(){
    if (this.props.chart) {
      this.injectLegend();
    }
  }

  componentWillUnmount(){
    
  }

  componentDidUpdate() {
    if (this.props.chart) {
      this.injectLegend();
    }
  }

  injectLegend(){
    window[this.props.chartId] = this.props.chart;
    document.getElementById(this.props.legendId).innerHTML = this.props.chart.generateLegend();
  }

  render() {
    return (
      <div id={this.props.legendId} className="graph-legend" />
    );
  }
};

export default ChartLegend;

