import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import { LineChart } from 'react-d3-basic';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';

var x = (point) => {
  return point.index;
};

var margins = { left: 50, right: 50, top: 10, bottom: 30 }
  , width = 560
  , height = 300;

class ExercisesChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      chartSeries: [],
      width: width,
      height: height,
      margins: margins,
      title: "User sample",
      listData: {}
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.resize = throttle(this.resize, 200).bind(this);
    this.calcListData = this.calcListData.bind(this);
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

  calcListData(exercises) {
    let min = Infinity, max = -Infinity, avg = 0;
    exercises.forEach(exercise => {
      if (exercise.reps.length < min) min = exercise.reps.length;
      if (exercise.reps.length > max) max = exercise.reps.length;
      if (typeof exercise.reps.length == 'number') avg += exercise.reps.length;
    })

    avg = Number((avg / exercises.length).toFixed(2));
    
    return { Minimum: min, Maximum: max, Average: avg };
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercises: exerciseState.exercises,
      chartSeries: this.chartSeries(),
      listData: this.calcListData(exerciseState.exercises)
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
    var newWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (newWidth < 600) {
      var newMargin = newWidth / 12;
      this.setState({
        width: newWidth - 40,
        margins: {left: newMargin, right: (newMargin - 12), top: 10, bottom: 30}
      });
    } else {
      this.setState({
        width: width,
        height: height,
        margins: margins
      })
    }
  }

  render() {
    return (
      <div className="ExercisesChartPanel graph-panel panel">
        <h1 className="title">Exercises Chart</h1>
        <div style={{"width": this.state.width+"px"}} className="chart-container">
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

export default ExercisesChartPanel;

