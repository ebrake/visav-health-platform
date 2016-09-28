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
      dropdownOptions: []
    };

    ExerciseActions.getExercises(this.props.patientId);

    this.exercisesChanged = this.exercisesChanged.bind(this);
  }

  chartOptions(){
    let tooltips = Object.assign({ callbacks: { title: chartUtil.callbacks.makeTitleIntoDate } }, chartUtil.tooltips);

    return {
      scales: {
        xAxes: chartUtil.axes.timeXAxes,
        yAxes: chartUtil.axes.defaultYAxes,
      },
      tooltips: tooltips,
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false
    }
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercises: exerciseState.exercises,
      chartData: chartUtil.makeExerciseChartData(exerciseState.exercises)
    });
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
  }

  render() {
    return (
      <div className="ExercisesChartPanel graph-panel panel">
        <h1 className="title">Range of Motion: Last 2 Weeks</h1>
        <div className="chart-container">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} height={chartUtil.chartHeight} />
        </div>
      </div>
    );
  }
};

export default ExercisesChartPanel;
