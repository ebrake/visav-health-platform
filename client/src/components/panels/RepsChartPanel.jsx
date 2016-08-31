import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import chartUtil from '../utils/chartUtil';

class RepsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercise: undefined,
      exerciseName: 'LOADING...',
      chartData: { labels: [], datasets: [] }
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
      maintainAspectRatio: false
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

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
  }

  render() {
    return (
      <div id="RepsChartPanel" className="graph-panel panel">
        <h1 className="title">
          Range of Motion: Last Exercise
        </h1>
        <div className="flex-row">
          <Line data={this.state.chartData} options={this.chartOptions()} height={300} />
        </div>
      </div>
    );
  }
};

export default RepsChartPanel;

