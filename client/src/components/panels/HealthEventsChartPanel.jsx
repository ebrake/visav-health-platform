import React from 'react';
import { Line } from 'react-chartjs-2';
import HealthEventStore from '../../alt/stores/HealthEventStore';
import HealthEventActions from '../../alt/actions/HealthEventActions';
import chartUtil from '../utils/chartUtil';

class HealthEventsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      healthEvents: [],
      healthEvent: undefined,
      chartData: { datasets: [] },
      dropdownOptions: [],
    };

    HealthEventActions.getHealthEvents(this.props.patientId);

    this.formatFooter = this.formatFooter.bind(this);
    this.healthEventsChanged = this.healthEventsChanged.bind(this);
    this.onHealthEventTypeSelected = this.onHealthEventTypeSelected.bind(this);
    this.pickHealthEventIfNoneSelected = this.pickHealthEventIfNoneSelected.bind(this);
  }

  componentDidMount(){
    HealthEventStore.listen(this.healthEventsChanged);
  }

  componentWillUnmount(){
    HealthEventStore.unlisten(this.healthEventsChanged);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.patientId !== this.props.patientId) {
      HealthEventActions.getHealthEvents(nextProps.patientId);
    }
  }

  getYAxesFormat() {
    let yAxes = JSON.parse(JSON.stringify(chartUtil.axes.defaultYAxes));
    yAxes[0].ticks.suggestedMin = 0;
    yAxes[0].ticks.suggestedMax = 10;

    return yAxes;
  }

  formatLabel(helper, chartData) {
    let dataPoint = chartData.datasets[helper.datasetIndex].data[helper.index];
    return dataPoint.type;
  }

  modifier(num) {
    if (num < 3)
      return 'some';
    if (num < 5)
      return 'minor';
    if (num < 7)
      return 'signifificant';
    if (num < 9)
      return 'severe';

    return 'intense';
  }

  formatFooter(helper, chartData) {
    helper = helper[0];
    let dataPoint = chartData.datasets[helper.datasetIndex].data[helper.index];
    
    return [
      'The patient reported '+this.modifier(dataPoint.y)+' '+dataPoint.type.toLowerCase(),
      'with an intensity of '+dataPoint.y+'.'
    ];
  }

  chartOptions(){
    let tooltips = Object.assign({ 
      callbacks: { 
        title: chartUtil.callbacks.makeTitleIntoDate,
        label: this.formatLabel,
        footer: this.formatFooter
      } 
    }, chartUtil.tooltips);

    return {
      scales: {
        xAxes: chartUtil.axes.timeXAxes,
        yAxes: this.getYAxesFormat()
      },
      pan: {
        enabled: true,
        mode: 'x'
      },
      zoom: {
        enabled: false
      },
      tooltips: tooltips,
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false
    }
  }

  healthEventsChanged(healthEventState){
    let chartData = chartUtil.makeHealthEventChartData(healthEventState.healthEvents);
    let dropdownOptions = chartData.datasets.map(ds => { return ds.exposedName });

    this.setState({
      healthEvents: healthEventState.healthEvents,
      chartData: chartData,
      dropdownOptions: dropdownOptions
    });

    this.pickHealthEventIfNoneSelected();
  }

  onHealthEventTypeSelected(selected) {
    let selectedHealthEvent = selected.value;
    let chartData = this.state.chartData;

    this.setState({
      healthEvent: selectedHealthEvent
    });

    if (this.refs && this.refs.chart && this.refs.chart.chart_instance){
      let ci = this.refs.chart.chart_instance;
      chartData.datasets.forEach((ds, i) => {
        if (ds.exposedName === selectedHealthEvent) {
          ci.getDatasetMeta(i).hidden = false;
        } else {
          ci.getDatasetMeta(i).hidden = true;
        }
      })
      ci.update();
    }
  }

  pickHealthEventIfNoneSelected() {
    if (this.state.healthEvent)
      return;

    let chartData = this.state.chartData;
    if (!chartData || !chartData.datasets || chartData.datasets.length < 1)
      return;

    this.onHealthEventTypeSelected({ value: chartData.datasets[0].exposedName });
  }

  render() {
    return (
      <div className="HealthEventsChartPanel graph-panel panel">
        <h1 className="title">Pain</h1>
        <div className="chart-container account-for-dropdown">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} />
        </div>
      </div>
    );
  }
};

export default HealthEventsChartPanel;
