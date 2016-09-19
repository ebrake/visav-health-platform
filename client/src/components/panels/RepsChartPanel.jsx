import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ChartLegend from './ChartLegend';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import chartUtil from '../utils/chartUtil';

class RepsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercise: undefined,
      chartData: { labels: [], datasets: [] },
      chart: undefined,
      currentLegend: '',
      chartId: 'RepsChartIdentifierForGlobalChartLegendDatasetToggle'
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
  }

  chartOptions(){
    return {
      scales: {
        xAxes: chartUtil.axes.categoryXAxes
      },
      tooltips: {
        titleFontColor: chartUtil.tooltips.titleFontColor,
        bodyFontColor: chartUtil.tooltips.bodyFontColor
      },
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false,
      legendCallback: chartUtil.legendCallback(this.state.chartId)
    }
  }

  calculateChartData(){
    return chartUtil.makeRepChartData(this.state.exercise);
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercise: exerciseState.displayedExercise,
      chartData: this.calculateChartData(exerciseState.displayedExercise)
    })
  }

  componentDidUpdate(){
    if (this.refs.chart.chart_instance.generateLegend().toString() != this.state.currentLegend){
      this.setState({
        chart: this.refs.chart.chart_instance,
        currentLegend: this.refs.chart.chart_instance.generateLegend().toString()
      })
    }
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
  }

  render() {
    return (
      <div className="RepsChartPanel graph-panel panel">
        <h1 className="title">
          Range of Motion: Last Exercise
        </h1>
        <ChartLegend legendId="RepsChartLegend" chartId={this.state.chartId} chart={this.state.chart} />
        <div className="chart-container">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} height={chartUtil.chartHeight} />
        </div>
      </div>
    );
  }
};

export default RepsChartPanel;

