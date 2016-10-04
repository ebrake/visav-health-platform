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

  getXAxesFormat() {
    let xAxes = JSON.parse(JSON.stringify(chartUtil.axes.timeXAxes));
    var time = new Date();
    time.setHours(0, 0, 0, 0);
    time = time.getTime();
    xAxes[0].time.min = time - 1000*60*60*24*15;
    xAxes[0].time.max = time;
    xAxes[0].ticks.maxRotation = 0;
    xAxes[0].ticks.minRotation = 0;

    xAxes[0].afterBuildTicks = function(scale) {
      scale.ticks = scale.ticks.slice(1);

      return scale;
    }

    return xAxes;
  }

  getYAxesFormat() {
    let yAxes = JSON.parse(JSON.stringify(chartUtil.axes.defaultYAxes));
    yAxes[0].ticks.suggestedMin = 0;
    yAxes[0].ticks.suggestedMax = 10000;

    return yAxes;
  }

  chartOptions(){
    let tooltips = Object.assign({ callbacks: { title: chartUtil.callbacks.makeTitleIntoDay } }, chartUtil.tooltips);

    return {
      scales: {
        xAxes: this.getXAxesFormat(),
        yAxes: this.getYAxesFormat()
      },
      pan: {
        enabled: true,
        mode: 'x',
        limits: {
          test: 'test' 
        }
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

