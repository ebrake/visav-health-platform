import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ChartLegend from './ChartLegend';
import HealthEventStore from '../../alt/stores/HealthEventStore';
import HealthEventActions from '../../alt/actions/HealthEventActions';
import chartUtil from '../utils/chartUtil';

class HealthEventsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      healthEvents: [],
      chartData: { datasets: [] },
      dropdownOptions: []
    };

    HealthEventActions.getHealthEvents(this.props.patientId);

    this.healthEventsChanged = this.healthEventsChanged.bind(this);
  }

  chartOptions(){
    let tooltips = Object.assign({ callbacks: { title: chartUtil.callbacks.makeTitleIntoDate } }, chartUtil.tooltips);

    return {
      scales: {
        xAxes: chartUtil.axes.timeXAxes,
        yAxes: chartUtil.axes.defaultYAxes
      },
      tooltips: tooltips,
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false
    }
  }

  healthEventsChanged(healthEventState){
    this.setState({
      healthEvents: healthEventState.healthEvents,
      chartData: chartUtil.makeHealthEventChartData(healthEventState.healthEvents)
    });
  }

  componentDidMount(){
    HealthEventStore.listen(this.healthEventsChanged);
  }

  componentWillUnmount(){
    HealthEventStore.unlisten(this.healthEventsChanged);
  }

  render() {
    return (
      <div className="HealthEventsChartPanel graph-panel panel">
        <h1 className="title">Pain & Swelling: Last 2 Weeks</h1>
        <div className="chart-container">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} />
        </div>
      </div>
    );
  }
};

export default HealthEventsChartPanel;
