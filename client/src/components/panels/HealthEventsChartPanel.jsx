import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import { LineChart } from 'react-d3-basic';
import HealthEventStore from '../../alt/stores/HealthEventStore';
import HealthEventActions from '../../alt/actions/HealthEventActions';

var x = (point) => {
  return point.index;
};

class HealthEventsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      healthEvents: [],
      chartSeries: [],
      width: 560,
      height: 300,
      margins: {left: 60, right: 40, top: 10, bottom: 30},
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

  chartData(){
    let dataArray = [];
    var healthEvents  = this.state.healthEvents;
    if(healthEvents && healthEvents.length > 0) {
      for(var i = 0; i < healthEvents.length; i++){
        let pointDict = {};
        pointDict['intensity'] = healthEvents[i].intensity;
        pointDict['date'] = healthEvents[i].date;
        pointDict['index'] = i;
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
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 600) {
      var newMargin = width / 12;
      this.setState({
        width: width - 40,
        margins: {left: newMargin, right: (newMargin - 12), top: 50, bottom: 50}
      });
    }
  }

  render() {
    return (
      <div className="HealthEventsChartPanel panel">
        <h1 className="title">Health Events Chart</h1>
        <div style={{"width": this.state.width+"px"}} className="chart-container">
          <LineChart
            margins= {this.state.margins}
            title={this.state.title}
            data={this.chartData()}
            width={this.state.width}
            height={this.state.height}
            chartSeries={this.state.chartSeries}
            x={x}
          ></LineChart>
        </div>
      </div>
    );
  }
};

export default HealthEventsChartPanel;

