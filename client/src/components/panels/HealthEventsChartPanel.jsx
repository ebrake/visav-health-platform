import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import HealthEventStore from '../../alt/stores/HealthEventStore';
import HealthEventActions from '../../alt/actions/HealthEventActions';
import chartUtil from '../utils/chartUtil';

class HealthEventsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      healthEvents: [],
      chartData: { datasets: [] }
    };

    HealthEventActions.getHealthEvents();

    this.healthEventsChanged = this.healthEventsChanged.bind(this);
  }

  chartOptions(){
    return {
      scales: {
        xAxes: chartUtil.axes.timeXAxes
      },
      tooltips: {
        callbacks: {
          title: chartUtil.callbacks.makeTitleIntoDate
        }
      },
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false
    }
  }

  calculateChartData(healthEvents){
    return chartUtil.makeHealthEventChartData(healthEvents);
  }

  healthEventsChanged(healthEventState){
    this.setState({
      healthEvents: healthEventState.healthEvents,
      chartData: this.calculateChartData(healthEventState.healthEvents)
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
      <div id="HealthEventsChartPanel" className="graph-panel panel">
        <h1 className="title">Pain & Swelling: Last 2 Weeks</h1>
        <div className="flex-row">
          <Line data={this.state.chartData} options={this.chartOptions()} height={300} />
        </div>
      </div>
    );
  }
};

export default HealthEventsChartPanel;
