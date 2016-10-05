import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ChartLegend from './ChartLegend';
import chartUtil from '../utils/chartUtil';

class ActivityChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: chartUtil.makeActivityChartData()
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
    yAxes[0].ticks.suggestedMin = 0;
    yAxes[0].ticks.suggestedMax = 10000;

    return yAxes;
  }

  formatLabel(helper, chartData) {
    return 'Activity';
  }

  formatFooter(helper, chartData) {
    helper = helper[0];
    let dataPoint = chartData.datasets[helper.datasetIndex].data[helper.index];
    
    return [
      'The patient took a total of '+dataPoint.y+' steps,',
      'travelling approximately '+((dataPoint.y*0.8)/1000).toFixed(1)+'km.'
    ];
  }

  chartOptions(){
    let tooltips = Object.assign({ 
      callbacks: { 
        title: chartUtil.callbacks.makeTitleIntoDay,
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
      <div className="ActivityChartPanel graph-panel panel">
        <h1 className="title">Activity</h1>
        <div className="chart-container">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} />
        </div>
      </div>
    );
  }
};

export default ActivityChartPanel;

