import React, { Component } from 'react';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import { LineChart } from 'react-d3-basic';

var x = (point) => {
  return point.index;
};

class Exercises extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      chartSeries: [],
      width: 600,
      height: 300,
      margins: {left: 60, right: 40, top: 50, bottom: 50},
      title: "User sample"
    };
    ExerciseActions.getExercises();
    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.resize = this.resize.bind(this);
  }

  chartSeries(){
    return [{
      field: 'value',
      name: this.unit(),
      color: '#ff7f0e'
    }];
  }

  unit(){
    var exercises = this.state.exercises;
    if (exercises && exercises.length > 0 && exercises[0].reps && exercises[0].reps.length > 0){
      return exercises[0].reps[0].unit;
    }
    else return 'No unit'
  }

  chartData(){
    let dataArray = [];
    let exercises = this.state.exercises;
    if (exercises.length > 0) {
      name = exercises[0].type;
      for(var i = 0; i < exercises.length; i++){
        let pointDict = {};
        if (exercises[i].reps.length > 0) {
          pointDict['value'] = this.avgValueForExercise(exercises[i]);
          pointDict['unit'] = exercises[i].reps[0].unit;//assumes all reps have same unit for one exercise
          pointDict['date'] = exercises[i].date;
        }
        else{
          pointDict['value'] = 0;
          pointDict['unit'] = 'NO REPS';
          pointDict['date'] = new Date();
        }
        pointDict['index'] = i;
        pointDict['exerciseName'] = exercises[i].type;
        dataArray.push(pointDict);
      }
    }
    return dataArray;
  }

  avgValueForExercise(exercise){
    if (exercise.reps.length > 0) {
      let avg = 0;
      for(var i = 0; i < exercise.reps.length; i++){
        avg += exercise.reps[i].value / exercise.reps.length;
      }
      return avg;
    }
    else{
      return 0;
    }
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercises: exerciseState.exercises,
      chartSeries: this.chartSeries()
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
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 640) {
      var newMargin = width / 12;
      this.setState({
        width: width - 40,
        margins: {left: newMargin, right: (newMargin - 12), top: 50, bottom: 50}
      });
    }
  }

  render() {
    return (
      <div className="Exercises graph-panel panel">
        <h1 className="title">Exercises Chart</h1>
        <div style={{"width": this.state.width+"px", "margin": "0 auto"}}>
          <LineChart
            margins= {this.state.margins}
            title={this.state.title}
            data={this.chartData()}
            width={this.state.width}
            height={this.state.height}
            chartSeries={this.chartSeries()}
            x={x}
          ></LineChart>
        </div>
      </div>
    );
  }
};

export default Exercises;

