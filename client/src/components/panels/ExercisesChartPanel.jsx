import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import VisavList from './VisavList';
import colors from '../utils/colors';
import chartDataFormatter from '../utils/chartDataFormatter';

var x = (point) => {
  return point.index;
};

var margins = { left: -10, right: 40, top: 10, bottom: 20 }
  , width = 1000
  , height = 300
  , fillColors = [
      colors.primaryGraphColor, 
      colors.secondaryGraphColor, 
      colors.tertiaryGraphColor,
      colors.red,
      colors.green
    ];

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
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
    window.removeEventListener('resize', this.resize);
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
        <div style={{"width": this.state.width+"px"}} className="rechart-container">
          <AreaChart width={this.state.width} height={this.state.height} data={this.chartData()}
            margin={this.state.margins} >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" tickFormatter={this.tickFormatter} interval={0} />
            <YAxis domain={['auto', 'auto']} />
            <Legend verticalAlign="top" height={30} />
            <Tooltip content={<ExercisesTooltip />} />
            { 
              this.state.keys.map((key, i) => {
                if (i >= fillColors.length) 
                  return null;

                return <Area name={this.unit()+' ('+key.toLowerCase()+')'} type="monotone" dataKey={key} stroke={fillColors[i]} fillOpacity={0.1} fill={fillColors[i]} key={i} />;
              })
            }
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
          <span className="value">{'date : '+label}</span>
          <span className="value">{value}</span>
        </div>
      );
    }

    return null;
  }
}

export default ExercisesChartPanel;
