import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import HealthEventStore from '../../alt/stores/HealthEventStore';
import HealthEventActions from '../../alt/actions/HealthEventActions';
import VisavList from './VisavList';
import PanelConfig from './PanelConfig';
import chartDataFormatter from '../utils/chartDataFormatter';

var x = (point) => {
  return point.index;
};

var margins = { left: -10, right: 40, top: 10, bottom: 20 }
  , width = 1000
  , height = 300;

class HealthEventsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      healthEvents: [],
      chartSeries: [],
      width: width,
      height: height,
      margins: margins,
      title: "User sample",
      listData: {}
    };

    HealthEventActions.getHealthEvents();

    this.healthEventsChanged = this.healthEventsChanged.bind(this);
    this.resize = debounce(this.resize, 30).bind(this);
    this.calcListData = this.calcListData.bind(this);
  }

  chartSeries(){
    return [{
      field: 'intensity',
      name: 'Health',
      color: '#ff7f0e'
    }];
  }

  format(date){
    date = new Date(date);
    return date.toLocaleDateString();
  }

  chartData(){
    return chartDataFormatter.makeHealthEventChartData(this.state.healthEvents);
  }

  calcListData(healthEvents) {
    let min = Infinity, max = -Infinity, avg = 0;

    healthEvents.forEach(he => {
      if (he.intensity < min) min = he.intensity;
      if (he.intensity > max) max = he.intensity;
      if (typeof he.intensity == 'number') avg += he.intensity;
    })

    min = Math.round(min);
    max = Math.round(max);
    avg = Math.round((avg / healthEvents.length));

    return { Minimum: min, Maximum: max, Average: avg };
  }

  healthEventsChanged(healthEventState){
    this.setState({
      healthEvents: healthEventState.healthEvents,
      chartSeries: this.chartSeries(),
      listData: this.calcListData(healthEventState.healthEvents)
    });
  }

  componentDidMount(){
    HealthEventStore.listen(this.healthEventsChanged);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount(){
    HealthEventStore.unlisten(this.healthEventsChanged);
    window.removeEventListener('resize', this.resize);
  }

  resize(){
    var diff = 100
      , newWidth = document.getElementById("HealthEventsChartPanel").offsetWidth;

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
      <div id="HealthEventsChartPanel" className="graph-panel panel">
        <h1 className="title">Pain & Swelling: Last 2 Weeks</h1>
        <div className="flex-row">
          <AreaChart width={this.state.width} height={this.state.height} data={this.chartData()}
            margin={this.state.margins} >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" tickFormatter={this.tickFormatter} />
            <YAxis domain={['auto', 'auto']} />
            <Legend verticalAlign="top" height={50} />
            <Tooltip content={<HealthEventsToolTip />} />
            <Area type="monotone" dataKey="swelling" stroke={PanelConfig.fillColors[0]} fillOpacity={PanelConfig.fillOpacity} fill={PanelConfig.fillColors[0]} />
            <Area type="monotone" dataKey="pain" stroke={PanelConfig.fillColors[1]} fillOpacity={PanelConfig.fillOpacity} fill={PanelConfig.fillColors[1]} />
          </AreaChart>
        </div>
      </div>
    );
  }
};

class HealthEventsToolTip extends React.Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      var title = 'Health Event', value = '';
      if (payload && payload[0]) {
        title += ': '+payload[0].payload.name;
        value0 = payload[0].name+' : '+payload[0].value;
        value1 = payload[1].name+' : '+payload[1].value;
      }

      return (
        <div className="chart-tooltip">
          <span className="title">{`${title}`}</span>
          <span className="value">{'date : '+label}</span>
          <span className="value">{value0}</span>
          <span className="value">{value1}</span>
        </div>
      );
    }

    return null;
  }
}

export default HealthEventsChartPanel;
