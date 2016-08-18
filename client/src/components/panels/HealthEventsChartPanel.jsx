import React, { Component } from 'react';
import HealthEventStore from '../../alt/stores/HealthEventStore';
import HealthEventActions from '../../alt/actions/HealthEventActions';
import { LineChart } from 'react-d3-basic';
let width = 700,
  height = 300,
  margins = {left: 100, right: 100, top: 50, bottom: 50},
  title = "User sample";
var x = (point) => {
  return point.index;
};
class HealthEventsChartPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      healthEvents: [],
      chartSeries: []
    };
    HealthEventActions.getHealthEvents();
    this.healthEventsChanged = this.healthEventsChanged.bind(this);
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
    }
    return dataArray;
  }

  healthEventsChanged(healthEventState){
    this.setState({
      healthEvents: healthEventState.healthEvents,
      chartSeries: this.chartSeries()
    });
  }

  componentDidMount(){
    HealthEventStore.listen(this.healthEventsChanged);
  }

  componentWillUnmount(){
    HealthEventStore.unlisten(this.healthEventsChanged);
  }

  render() {
    return (
      <div className="HealthEventsChartPanel panel">
        <h1 className="title">Health Events Chart</h1>
        <LineChart
          margins= {margins}
          title={title}
          data={this.chartData()}
          width={width}
          height={height}
          chartSeries={this.chartSeries()}
          x={x}
        ></LineChart>
      </div>
    );
  }
};

export default HealthEventsChartPanel;

