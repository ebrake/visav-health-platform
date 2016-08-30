import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { Line } from 'react-chartjs-2';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import VisavList from './VisavList';
import PanelConfig from './PanelConfig';
import chartDataFormatter from '../utils/chartDataFormatter';

var margins = { left: -10, right: 40, top: 10, bottom: 20 }
  , width = 700
  , height = 300;

class ExercisesChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      width: width,
      height: height,
      margins: margins,
      title: "User sample",
      chartData: { datasets: [] }
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.resize = debounce(this.resize, 30).bind(this);
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
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
    window.removeEventListener('resize', this.resize);
  }

  resize(){
    var diff = 100
      , newWidth = document.getElementById("ExercisesChartPanel").offsetWidth;

    this.setState({
      width: newWidth - diff
    });
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
