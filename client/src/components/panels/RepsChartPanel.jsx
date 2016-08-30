import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import VisavList from './VisavList';
import PanelConfig from './PanelConfig';

var x = (point) => {
  return point.index;
};

var margins = { left: -10, right: 40, top: 10, bottom: 20 }
  , width = 1000
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
      margins: margins,
      title: "User sample",
      listData: {}
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.unit = this.unit.bind(this);
    this.resize = debounce(this.resize, 30).bind(this);
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
          pointDict['value'] = Math.round(reps[i].value);
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

    min = Math.round(min);
    max = Math.round(max);
    avg = Math.round((avg / exercise.reps.length));

    return { title: 'Details', Exercise: exercise.type.slice(10), Minimum: min, Maximum: max, Average: avg };
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
    var diff = 100
      , newWidth = document.getElementById("RepsChartPanel").offsetWidth;

    this.setState({
      width: newWidth - diff
    });
  }

  render() {
    return (
      <div id="RepsChartPanel" className="graph-panel panel">
        <h1 className="title">
          Range of Motion: Last Exercise
        </h1>
        <div className="flex-row">
          <AreaChart width={this.state.width} height={this.state.height} data={this.chartData()}
            margin={this.state.margins} >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="index" />
            <YAxis domain={['auto', 'auto']} />
            <Legend verticalAlign="top" height={PanelConfig.legendHeight} color="#fff" />
            <Tooltip content={<RepsTooltip />} />
            <Area name={this.unit()} type="monotone" dataKey="value" stroke={PanelConfig.fillColors[0]} fillOpacity={PanelConfig.fillOpacity} fill={PanelConfig.fillColors[0]} />
          </AreaChart>
        </div>
      </div>
    );
  }
};

class RepsTooltip extends React.Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      var value = '';
      if (payload && payload[0]) {
        value = payload[0].name+' : '+payload[0].value;
      }

      return (
        <div className="chart-tooltip">
          <span className="title">{`${label}`}</span>
          <span className="value">{value}</span>
        </div>
      );
    }

    return null;
  }
}

export default RepsChartPanel;

