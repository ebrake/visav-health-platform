import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import { LineChart } from 'react-d3-basic';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import VisavList from './VisavList';

var x = (point) => {
  return point.index;
};

var margins = { left: 50, right: 50, top: 10, bottom: 30 }
  , width = 560
  , height = 300;

class RepsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercise: undefined,
      exerciseName: 'LOADING...',
      chartSeries: [],
      width: width,
      height: height,
      margins: {left: 50, right: 50, top: 10, bottom: 30},
      title: "User sample",
      listData: {}
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.unit = this.unit.bind(this);
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

  calcListData(exercise) {
    let min = Infinity, max = -Infinity, avg = 0;

    exercise.reps.forEach(rep => {
      if (rep.value < min) min = rep.value;
      if (rep.value > max) max = rep.value;
      if (typeof rep.value == 'number') avg += rep.value;
    })

    avg = Number((avg / exercise.reps.length).toFixed(2));

    return { Minimum: min, Maximum: max, Average: avg };
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercise: exerciseState.displayedExercise,
      chartSeries: this.chartSeries(),
      listData: this.calcListData(exerciseState.displayedExercise)
    })
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
        margins: {left: newMargin, right: newMargin, top: 10, bottom: 30}
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
      <div className="RepsChartPanel graph-panel panel">
        <h1 className="title">
          Rep chart {this.state.exercise ? 'for exercise: '+this.state.exercise.type.slice(10) : ''}
        </h1>
        <div style={{"width": this.state.width+"px"}} className="chart-container">
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
        <VisavList data={this.state.listData} />
      </div>
    );
  }
};

export default RepsChartPanel;

