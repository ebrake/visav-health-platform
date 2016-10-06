import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ChartLegend from './ChartLegend';
import chartUtil from '../utils/chartUtil';

class HeartRateChartPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: chartUtil.makeHeartRateChartData()
    };
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  componentWillReceiveProps(nextProps){
    if (nextProps.patientId !== this.props.patientId) {
      //get different data... ha
    }
  }

  getYAxesFormat() {
    let yAxes = JSON.parse(JSON.stringify(chartUtil.axes.defaultYAxes));
    yAxes[0].ticks.suggestedMin = 50;
    yAxes[0].ticks.suggestedMax = 150;

    return yAxes;
  }

  formatLabel(helper, chartData) {
    let dataPoint = chartData.datasets[helper.datasetIndex].data[helper.index];
    return 'Heart Rate';
  }

  formatFooter(helper, chartData) {
    helper = helper[0];
    let dataPoint = chartData.datasets[helper.datasetIndex].data[helper.index];
    
    return [
      'The patient measured their heartbeat', 
      'at '+dataPoint.y+' beats per minute.'
    ];
  }

  chartOptions(){
    let tooltips = Object.assign({ 
      callbacks: { 
        title: chartUtil.callbacks.makeTitleIntoDate,
        label: this.formatLabel,
        footer: this.formatFooter
      } 
    }, chartUtil.tooltips);

    return {
      scales: {
        xAxes: chartUtil.axes.timeXAxes,
        yAxes: this.getYAxesFormat()
      },
      pan: {
        enabled: true,
        mode: 'x'
      },
      zoom: {
        enabled: false
      },
      tooltips: tooltips,
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false
    }
  }

  render() {
    return (
      <div className="HeartRateChartPanel graph-panel panel">
        <h1 className="title">Heart Rate</h1>
        <div className="chart-container">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} />
        </div>
      </div>
    );
  }
};

export default HeartRateChartPanel;

