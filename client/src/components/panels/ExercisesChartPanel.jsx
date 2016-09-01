import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ChartLegend from './ChartLegend';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import chartUtil from '../utils/chartUtil';

class ExercisesChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      chartData: { datasets: [] },
      chart: undefined,
      currentLegend: '',
      chartId: 'ExercisesChartIdentifierForGlobalChartLegendDatasetToggle'
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
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

  calculateChartData(exercises){
    return chartUtil.makeExerciseChartData(exercises);
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercises: exerciseState.exercises,
      chartData: this.calculateChartData(exerciseState.exercises)
    });
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
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
      <div id="ExercisesChartPanel" className="graph-panel panel">
        <h1 className="title">Range of Motion: Last 2 Weeks</h1>
        <ChartLegend legendId="ExercisesChartLegend" chartId={this.state.chartId} chart={this.state.chart} />
        <div className="chart-container">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} height={chartUtil.chartHeight} />
        </div>
      </div>
    );
  }
};

export default ExercisesChartPanel;
