import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ChartLegend from './ChartLegend';
import ExerciseStore from '../../alt/stores/ExerciseStore';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import chartUtil from '../utils/chartUtil';
import VisavDropdown from '../inputs/VisavDropdown';

class ExercisesChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      chartData: { datasets: [] },
      dropdownOptions: [],
      exercise: undefined
    };

    ExerciseActions.getExercises(this.props.patientId);

    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.onExerciseTypeSelected = this.onExerciseTypeSelected.bind(this);
    this.pickExerciseIfNoneSelected = this.pickExerciseIfNoneSelected.bind(this);
  }

  chartOptions(){
    let tooltips = Object.assign({ callbacks: { title: chartUtil.callbacks.makeTitleIntoDate } }, chartUtil.tooltips);

    return {
      scales: {
        xAxes: chartUtil.axes.timeXAxes,
        yAxes: chartUtil.axes.defaultYAxes,
      },
      tooltips: tooltips,
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false
    }
  }

  exercisesChanged(exerciseState){
    let chartData = chartUtil.makeExerciseChartData(exerciseState.exercises);
    let dropdownOptions = chartData.datasets.map(ds => { return ds.exposedName });

    this.setState({
      exercises: exerciseState.exercises,
      chartData: chartData,
      dropdownOptions: dropdownOptions
    });

    this.pickExerciseIfNoneSelected();
  }

  onExerciseTypeSelected(selected) {
    let selectedExercise = selected.value;
    let chartData = this.state.chartData;

    this.setState({
      exercise: selectedExercise
    });

    if (this.refs && this.refs.chart && this.refs.chart.chart_instance){
      let ci = this.refs.chart.chart_instance;
      chartData.datasets.forEach((ds, i) => {
        if (ds.exposedName == selectedExercise) {
          ci.getDatasetMeta(i).hidden = false;
        } else {
          ci.getDatasetMeta(i).hidden = true;
        }
      })
      ci.update();
    }
  }

  pickExerciseIfNoneSelected() {
    if (this.state.exercise)
      return;

    let chartData = this.state.chartData;
    if (!chartData || !chartData.datasets || chartData.datasets.length < 1)
      return;

    this.onExerciseTypeSelected({ value: chartData.datasets[0].exposedName });
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
  }

  render() {
    return (
      <div className="ExercisesChartPanel graph-panel panel">
        <h1 className="title">Range of Motion: Last 2 Weeks</h1>
        <div className="chart-container">
          <VisavDropdown options={this.state.dropdownOptions} onChange={this.onExerciseTypeSelected} value={this.state.exercise} placeholder="Select an exercise type..." />
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} height={chartUtil.chartHeight} />
        </div>
      </div>
    );
  }
};

export default ExercisesChartPanel;
