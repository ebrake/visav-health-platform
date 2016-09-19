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
      chart: undefined,
      currentLegend: '',
      chartId: 'HealthEventsChartIdentifierForGlobalChartLegendDatasetToggle'
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
        },
        titleFontColor: chartUtil.tooltips.titleFontColor,
        bodyFontColor: chartUtil.tooltips.bodyFontColor
      },
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false,
      legendCallback: chartUtil.legendCallback(this.state.chartId)
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

  componentDidUpdate(){
    if (this.refs.chart.chart_instance.generateLegend().toString() != this.state.currentLegend){
      this.setState({
        chart: this.refs.chart.chart_instance,
        currentLegend: this.refs.chart.chart_instance.generateLegend().toString()
      })
    }
  }

  render() {
    return (
      <div className="HealthEventsChartPanel graph-panel panel">
        <h1 className="title">Pain & Swelling: Last 2 Weeks</h1>
        <ChartLegend legendId="HealthEventsChartLegend" chartId={this.state.chartId} chart={this.state.chart} />
        <div className="chart-container">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} height={chartUtil.chartHeight} />
        </div>
      </div>
    );
  }
};

export default HealthEventsChartPanel;
