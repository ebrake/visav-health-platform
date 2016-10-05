import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ChartLegend from './ChartLegend';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import chartUtil from '../utils/chartUtil';

class RepsChartPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercise: undefined,
      chartData: { labels: [], datasets: [] },
      dropdownOptions: []
    };

    ExerciseActions.getExercises(this.props.patientId);

    this.exercisesChanged = this.exercisesChanged.bind(this);
  }

  chartOptions(){
    return {
      scales: {
        xAxes: chartUtil.axes.categoryXAxes,
        yAxes: chartUtil.axes.defaultYAxes
      },
      tooltips: chartUtil.tooltips,
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false
    }
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercise: exerciseState.displayedExercise,
      chartData: chartUtil.makeRepChartData(exerciseState.displayedExercise)
    })
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.patientId !== this.props.patientId) {
      ExerciseActions.getExercises(nextProps.patientId);
    }
  }

  render() {
    return (
      <div className="RepsChartPanel graph-panel panel">
        <h1 className="title">
          Range of Motion: Last Exercise
        </h1>
        <div className="chart-container">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} />
        </div>
      </div>
    );
  }
};

export default RepsChartPanel;

