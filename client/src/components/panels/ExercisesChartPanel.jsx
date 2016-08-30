import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import Chart from 'chart.js';
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
    this.buildNewChart = this.buildNewChart.bind(this);
    this.resize = debounce(this.resize, 30).bind(this);
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
      chartSeries: this.chartSeries(),
      chartData: this.calculateChartData(exerciseState.exercises)
    });
  }

  buildNewChart(){
    if (!this.state.chartData) return;

    if (this.state.chart){
      this.state.chart.destroy();
    }

    let chartCanvas = this.refs['exercise-chart'];

    let lineChart = new Chart(chartCanvas, {
      type: 'line',
      data: this.state.chartData,
      options: this.chartOptions()
    });

    this.setState({chart: lineChart});
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
    window.addEventListener('resize', this.resize);
    this.resize();

    this.buildNewChart();
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
    window.removeEventListener('resize', this.resize);
  }

  componentDidUpdate(){
    if (!this.state.chart || this.state.chartData.datasets.length != this.state.chart.data.datasets.length) {
      this.buildNewChart();
    }
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
          <canvas ref={'exercise-chart'} className="flex-canvas" height={300} ></canvas>
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
