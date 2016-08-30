import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import Chart from 'chart.js';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import VisavList from './VisavList';
import PanelConfig from './PanelConfig';
import chartDataFormatter from '../utils/chartDataFormatter';

var x = (point) => {
  return point.index;
};

var margins = { left: -10, right: 40, top: 10, bottom: 20 }
  , width = 700
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
      listData: {},
      keys: ['value']
    };

    ExerciseActions.getExercises();

    this.exercisesChanged = this.exercisesChanged.bind(this);
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

  chartOptions(){
    return {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }]
      },
      responsive: true,
      maintainAspectRatio: false
    }
  }

  chartData(){
    return chartDataFormatter.makeExerciseChartData(this.state.exercises);
  }

  calcListData(exercises) {
    let min = Infinity, max = -Infinity, avg = 0;
    exercises.forEach(exercise => {
      if (exercise.reps.length < min) min = exercise.reps.length;
      if (exercise.reps.length > max) max = exercise.reps.length;
      if (typeof exercise.reps.length == 'number') avg += exercise.reps.length;
    })

    min = Math.round(min);
    max = Math.round(max);
    avg = Math.round((avg / exercises.length));
    
    return { Minimum: min, Maximum: max, Average: avg };
  }

  exercisesChanged(exerciseState){
    this.setState({
      exercises: exerciseState.exercises,
      chartSeries: this.chartSeries(),
      listData: this.calcListData(exerciseState.exercises),
      keys: chartDataFormatter.getKeysFor(exerciseState.exercises)
    });
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
    window.addEventListener('resize', this.resize);
    this.resize();

    let chartCanvas = this.refs['exercise-chart'];

    let lineChart = new Chart(chartCanvas, {
      type: 'line',
      data: this.chartData(),
      options: this.chartOptions()
    });

    this.setState({chart: lineChart});
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
    window.removeEventListener('resize', this.resize);
  }

  componentDidUpdate(){
    let chart = this.state.chart;
    if (chart)
      this.state.chart.update();
  }

  resize(){
    var diff = 100
      , newWidth = document.getElementById("ExercisesChartPanel").offsetWidth;

    this.setState({
      width: newWidth - diff
    });
  }

  tickFormatter(arg){
    var date = new Date(arg);
    return (date.getMonth()+1)+'/'+date.getDate();
  }

  render() {
    return (
      <div id="ExercisesChartPanel" className="graph-panel panel">
        <h1 className="title">Range of Motion: Last 2 Weeks</h1>
        <div className="flex-row">
          <canvas ref={'exercise-chart'} height={300} width={'100%'}></canvas>
        </div>
      </div>
    );
  }
};

class ExercisesTooltip extends React.Component {
  render() {
    const { active } = this.props;

    if (active) {
      console.dir(this.props);
      const { payload, label } = this.props;
      var title = 'No Exercises Done'
        , value = 'There were no exercises tracked for this date.'
        , date = '';

      if (payload) {
        payload.forEach(p =>{
          if (p.name == 'key') {
            title = 'Exercise: '+p.value+'';
          } else if (p.name == 'value') {
            value = 'degrees : '+p.value;
          } else if (p.name == 'date') {
            date = new Date(p.value).toLocaleDateString();
          }
        })
      }

      return (
        <div className="chart-tooltip">
          <span className="title">{`${title}`}</span>
          <span className="value">{'date : '+date}</span>
          <span className="value">{value}</span>
        </div>
      );
    }

    return null;
  }
}

export default ExercisesChartPanel;
