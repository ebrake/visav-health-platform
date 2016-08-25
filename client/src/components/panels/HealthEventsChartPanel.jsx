import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import HealthEventStore from '../../alt/stores/HealthEventStore';
import HealthEventActions from '../../alt/actions/HealthEventActions';
import VisavList from './VisavList';

var x = (point) => {
  return point.index;
};

var margins = { left: -10, right: 50, top: 10, bottom: 0 }
  , width = 560
  , height = 300
  , fillColor = '#00F0FF';

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
    this.resize = throttle(this.resize, 200).bind(this);
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
    return date.toLocaleDateString()+' '+date.toLocaleTimeString();
  }

  chartData(){
    let dataArray = [];
    var healthEvents  = this.state.healthEvents;
    if(healthEvents && healthEvents.length > 0) {
      for(var i = 0; i < healthEvents.length; i++){
        let pointDict = {};
        pointDict['intensity'] = Number((healthEvents[i].intensity*10).toFixed(2));
        pointDict['date'] = this.format(healthEvents[i].date);
        pointDict['index'] = i;
        pointDict['name'] = healthEvents[i].type;
        dataArray.push(pointDict);
      }
    }
    return dataArray;
  }

  calcListData(healthEvents) {
    let min = Infinity, max = -Infinity, avg = 0;

    healthEvents.forEach(he => {
      if (he.intensity < min) min = he.intensity;
      if (he.intensity > max) max = he.intensity;
      if (typeof he.intensity == 'number') avg += he.intensity;
    })

    min = Number(min.toFixed(2));
    max = Number(max.toFixed(2));
    avg = Number((avg / healthEvents.length).toFixed(2));

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
      <div className="HealthEventsChartPanel panel">
        <h1 className="title">Health Events Chart</h1>
        <div style={{"width": this.state.width+"px"}} className="chart-container">
          <AreaChart width={this.state.width} height={this.state.height} data={this.chartData()}
            margin={this.state.margins} >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" tickFormatter={this.tickFormatter} />
            <YAxis domain={['auto', 'auto']} />
            <Legend verticalAlign="top" height={30} />
            <Tooltip content={<HealthEventsToolTip />} />
            <Area type="monotone" dataKey="intensity" stroke={fillColor} fillOpacity={0.1} fill={fillColor} />
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

export default HealthEventsChartPanel;
