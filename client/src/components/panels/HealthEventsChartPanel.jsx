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
      tooltipData: {
        date: '',
        time: '',
        title: '',
        body: '',
      },
      tooltipStyle: {
        display: 'none'
      },
    };

    HealthEventActions.getHealthEvents(this.props.patientId);

    this.customTooltip = this.customTooltip.bind(this);
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

  healthEventsChanged(healthEventState){
    let chartData = chartUtil.makeHealthEventChartData(healthEventState.healthEvents);

    this.setState({
      healthEvents: healthEventState.healthEvents,
      chartData: chartData,
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

  formatTooltipBody(type, intensity) {
    return 'The patient reported '+this.modifier(intensity)+' '+type.toLowerCase()+' with an intensity of '+intensity+'.';
  }

  customTooltip(tooltip) {
    let newData = {
      date: '',
      time: '',
      title: '',
      body: '',
    }

    if (!tooltip || !tooltip.body || !tooltip.body[0] || !tooltip.title || tooltip.title.length < 1) {
      this.setState({
        tooltipStyle: {
          display: 'none'
        },
        tooltipData: newData
      });
      return;
    }

    //figure out what to display
    let rawInfo = tooltip.body[0].lines[0].split(':');
    let rawData = {
      type: rawInfo[0],
      value: Number(rawInfo[1]),
      date: new Date(tooltip.title[0]),
    }

    newData.date = chartUtil.formatters.getDateString(rawData.date);
    newData.time = chartUtil.formatters.getTimeString(rawData.date);
    newData.title = rawData.type;
    newData.body = this.formatTooltipBody(rawData.type, rawData.value);

    //figure out where to display it
    let newStyle = {
      display: 'block'
    }

    newStyle.top = tooltip.y;
    if (tooltip.y > 80) {
      newStyle.top -= 70;
    }
    
    newStyle.left = tooltip.x + 5;
    if (tooltip.xAlign === 'right') {
      newStyle.left -= 210;
    }

    //rerender component
    this.setState({ 
      tooltipStyle: newStyle,
      tooltipData: newData
    })
  }

  chartOptions(){
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
      tooltips: {
        enabled: false,
        custom: this.customTooltip
      },
      legend: chartUtil.legends.defaultLegend,
      responsive: true,
      maintainAspectRatio: false
    }
  }

  render() {
    return (
      <div className="HealthEventsChartPanel graph-panel panel">
        <h1 className="title">Pain</h1>
        <div className="chart-container account-for-dropdown">
          <Line ref='chart' data={this.state.chartData} options={this.chartOptions()} />
          <div className="chartjs-tooltip" style={this.state.tooltipStyle}>
            <span className="tooltip-date">{ this.state.tooltipData.date }</span>
            <span className="tooltip-time">{ this.state.tooltipData.time }</span>
            <span className="tooltip-title">{ this.state.tooltipData.title }</span>
            <span className="tooltip-body">{ this.state.tooltipData.body }</span>
          </div>
        </div>
      </div>
    );
  }
};

export default HealthEventsChartPanel;
