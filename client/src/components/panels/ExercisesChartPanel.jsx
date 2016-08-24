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

  format(date){
    date = new Date(date);
    return date.toLocaleDateString()+' '+date.toLocaleTimeString();
  }

  chartData(){
    let dataArray = [];
    let exercises = this.state.exercises;
    if (exercises.length > 0) {
      name = exercises[0].type;
      for(var i = 0; i < exercises.length; i++){
        let pointDict = {};
        if (exercises[i].reps.length > 0) {
          pointDict['value'] = Number(this.avgValueForExercise(exercises[i]).toFixed(2));
          pointDict['unit'] = exercises[i].reps[0].unit; //assumes all reps have same unit for one exercise
        } else {
          pointDict['value'] = 0;
          pointDict['unit'] = 'NO REPS';
        }
        pointDict['date'] = this.format(exercises[i].date);
        pointDict['index'] = i;
        pointDict['name'] = exercises[i].type;
        if (pointDict.unit != 'NO REPS') {
          dataArray.push(pointDict);
        }
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

    min = Number(min.toFixed(2));
    max = Number(max.toFixed(2));
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

  tickFormatter(arg){
    var date = new Date(arg);
    return (date.getMonth()+1)+'/'+date.getDate();
  }

  render() {
    return (
      <div className="ExercisesChartPanel graph-panel panel">
        <h1 className="title">Exercises Chart</h1>
        <div style={{"width": this.state.width+"px"}} className="chart-container">
          <AreaChart width={this.state.width} height={this.state.height} data={this.chartData()}
            margin={this.state.margins} >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" tickFormatter={this.tickFormatter} interval={0} />
            <YAxis domain={['auto', 'auto']} />
            <Legend verticalAlign="top" height={30} />
            <Tooltip content={<ExercisesTooltip />} />
            <Area name={this.unit()} type="monotone" dataKey="value" stroke={fillColor} fillOpacity={0.1} fill={fillColor} />
          </AreaChart>
        </div>
      </div>
    );
  }
};

class ExercisesTooltip extends React.Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      var title = 'Exercise', value = '';
      if (payload && payload[0]) {
        title = payload[0].payload.name;
        value = payload[0].name+' : '+payload[0].value;
      }

      return (
        <div className="chart-tooltip">
          <span className="title">{`${title}`}</span>
          <span className="value">{label}</span>
          <span className="value">{value}</span>
        </div>
      );
    }

    return null;
  }
}

export default ExercisesChartPanel;
