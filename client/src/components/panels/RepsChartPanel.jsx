import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import VisavList from './VisavList';

var x = (point) => {
  return point.index;
};

var margins = { left: -10, right: 50, top: 10, bottom: 0 }
  , width = 560
  , height = 300
  , fillColor = '#00F0FF';

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
          pointDict['value'] = Number(reps[i].value.toFixed(2));
          pointDict['unit'] = reps[i].unit;
          pointDict['date'] = reps[i].date;
          pointDict['index'] = "Rep "+i;
          dataArray.push(pointDict);
        }
      }
    }
    return dataArray;
  }

  calcListData(exercise) {
    if (!exercise) 
      return { Minimum: 0, Maximum: 0, Average: 0 };

    let min = Infinity, max = -Infinity, avg = 0;

    exercise.reps.forEach(rep => {
      if (rep.value < min) min = rep.value;
      if (rep.value > max) max = rep.value;
      if (typeof rep.value == 'number') avg += rep.value;
    });

    min = Number(min.toFixed(2));
    max = Number(max.toFixed(2));
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
          Rep Chart {this.state.exercise ? 'for '+this.state.exercise.type : ''}
        </h1>
        <div style={{"width": this.state.width+"px"}} className="chart-container">
          <AreaChart width={this.state.width} height={this.state.height} data={this.chartData()}
            margin={this.state.margins} >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="index" />
            <YAxis domain={['auto', 'auto']} />
            <Legend verticalAlign="top" height={30} />
            <Tooltip labelStyle={{fontWeight: 700}} itemStyle={{color: 'black'}} />
            <Area name={this.unit()} type="monotone" dataKey="value" stroke={fillColor} fillOpacity={0.1} fill={fillColor} />
          </AreaChart>
        </div>
        <VisavList data={this.state.listData} />
      </div>
    );
  }
};

export default RepsChartPanel;

