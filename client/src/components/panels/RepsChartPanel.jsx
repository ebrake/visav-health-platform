import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import { LineChart } from 'react-d3-basic';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';

var x = (point) => {
  return point.index;
};

class RepsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercise: undefined,
      exerciseName: 'LOADING...',
      chartSeries: [],
      width: 600,
      height: 300,
      margins: {left: 60, right: 40, top: 10, bottom: 30},
      title: "User sample"
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.unit = this.unit.bind(this);
    this.resize = throttle(this.resize, 200).bind(this);
    this.calcMinMaxAvgValue = this.calcMinMaxAvgValue.bind(this);
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

  calcMinMaxAvgValue(exercise) {
    let min = Infinity, max = -Infinity, avg = 0;

    exercise.reps.forEach(rep => {
      if (rep.value < min) min = rep.value;
      if (rep.value > max) max = rep.value;
      if (typeof rep.value == 'number') avg += rep.value;
    })

    avg = avg / exercise.reps.length;

    this.setState({
      data: { min: min, max: max, avg: avg }
    });

    console.log('Calculated min max avg value:');
    console.dir(this.state.data);
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercise: exerciseState.displayedExercise,
      chartSeries: this.chartSeries()
    })

    this.calcMinMaxAvgValue(exerciseState.displayedExercise);
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
      <div className="RepsChartPanel graph-panel panel">
        <h1 className="title">
          Rep chart {this.state.exercise ? 'for exercise: '+this.state.exercise.type.slice(10) : ''}
        </h1>
        <div style={{"width": this.state.width+"px", "margin": "0 auto"}}>
          <LineChart
            margins= {this.state.margins}
            title={this.state.title}
            data={this.chartData()}
            width={this.state.width}
            height={this.state.height}
            chartSeries={this.state.chartSeries}
            x={x}
          ></LineChart>
        </div>
      </div>
    );
  }
};

export default RepsChartPanel;

