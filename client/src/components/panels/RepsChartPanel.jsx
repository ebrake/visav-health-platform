import React, { Component } from 'react';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';

import { LineChart } from 'react-d3-basic';
let width = 700,
  height = 300,
  margins = {left: 100, right: 100, top: 50, bottom: 50},
  title = "User sample";
var x = (point) => {
  return point.index;
};
class RepsChartPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state = {
      exercise: undefined,
      exerciseName: 'LOADING...',
      chartSeries: []
    };
    ExerciseActions.getExercises();
    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.unit = this.unit.bind(this);

  }

  chartSeries(){
    return [{
      field: 'value',
      name: this.unit(),
      color: '#ff7f0e'
    }];
  }

  unit(){
    var exercise = this.state.exercise;
    if (exercise && exercise.reps && exercise.reps.length > 0){
      return exercise.reps[0].unit;
    }
    else return 'No unit'
  }

  chartData(){
    let dataArray = [];
    if(this.state.exercise){
      let reps = this.state.exercise.reps;
      if (reps.length > 0) {
        for(var i = 0; i < reps.length; i++){
          let pointDict = {};
          pointDict['value'] = reps[i].value;
          pointDict['unit'] = reps[i].unit;
          pointDict['date'] = reps[i].date;
          pointDict['index'] = i;
          dataArray.push(pointDict);
        }
      }
    }
    return dataArray;
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercise: exerciseState.displayedExercise,
    });
    this.setState({
      chartSeries: this.chartSeries()
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
      <div className="RepsChartPanel graph-panel panel">
        <h1 className="title">Rep chart for exercise: {this.exerciseName}</h1>
        <LineChart
          margins= {margins}
          title={title}
          data={this.chartData()}
          width={width}
          height={height}
          chartSeries={this.state.chartSeries}
          x={x}
        ></LineChart>
      </div>
    );
  }
};

export default RepsChartPanel;

