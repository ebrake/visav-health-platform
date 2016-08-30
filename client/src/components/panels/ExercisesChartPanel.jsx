import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import chartDataFormatter from '../utils/chartDataFormatter';

class ExercisesChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      chartData: { datasets: [] }
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
  }

  chartOptions(){
    return {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              day: 'MMM D'
            }
          },
          position: 'bottom'
        }]
      },
      tooltips: {
        callbacks: {
          title: chartDataFormatter.makeTitleIntoDate
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  }

  calculateChartData(exercises){
    return chartDataFormatter.makeExerciseChartData(exercises);
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

  render() {
    return (
      <div id="ExercisesChartPanel" className="graph-panel panel">
        <h1 className="title">Range of Motion: Last 2 Weeks</h1>
        <div className="flex-row">
          <Line data={this.state.chartData} options={this.chartOptions()} height={300} />
        </div>
      </div>
    );
  }
};

export default ExercisesChartPanel;
