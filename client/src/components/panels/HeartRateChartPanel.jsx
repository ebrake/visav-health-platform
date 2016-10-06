import React from 'react';
import { Line } from 'react-chartjs-2';
import chartUtil from '../utils/chartUtil';

class HeartRateChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: chartUtil.makeHeartRateChartData(),
      tooltipData: {
        date: '',
        title: '',
        body: '',
      },
      tooltipStyle: {
        display: 'none'
      },
    };

    this.customTooltip = this.customTooltip.bind(this);
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  componentWillReceiveProps(nextProps){
    if (nextProps.patientId !== this.props.patientId) {
      //get different data... ha
    }
  }

  getYAxesFormat() {
    let yAxes = JSON.parse(JSON.stringify(chartUtil.axes.defaultYAxes));
    yAxes[0].ticks.suggestedMin = 50;
    yAxes[0].ticks.suggestedMax = 150;

    return yAxes;
  }

  formatTooltipBody(value) {
    return 'The patient measured their heartbeat at '+value+' beats per minute.'
  }

  customTooltip(tooltip) {
    let newData = {
      date: '',
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
    newData.body = this.formatTooltipBody(rawData.value);

    //figure out where to display it
    let newStyle = {
      display: 'block'
    }

    newStyle.top = tooltip.y / 2;

    newStyle.left = tooltip.x + 5;
    if (tooltip.xAlign === 'right') {
      newStyle.left -= 210;
    } else if (tooltip.xAlign === 'center') {
      if (tooltip.x > 265)
        newStyle.left -= 270;
      else 
        newStyle.left += 55;
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
      <div className="HeartRateChartPanel graph-panel panel">
        <h1 className="title">Heart Rate</h1>
        <div className="chart-container">
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

export default HeartRateChartPanel;

