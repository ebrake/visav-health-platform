import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import AuthenticatedPage from './AuthenticatedPage';
import colors from '../utils/colors';

let chartData = [
  {
    name: "Lavon Hilll I",
    BMI: 20.57,
    age: 12,
    birthday: "1994-10-26T00:00:00.000Z",
    city: "Annatown",
    married: true,
    index: 1
  },
  {
    name: "Clovis Pagac",
    BMI: 24.28,
    age: 26,
    birthday: "1995-11-10T00:00:00.000Z",
    city: "South Eldredtown",
    married: false,
    index: 3
  },
  {
    name: "Gaylord Paucek",
    BMI: 24.41,
    age: 30,
    birthday: "1975-06-12T00:00:00.000Z",
    city: "Koeppchester",
    married: true,
    index: 5
  },
  {
    name: "Ash Kuhn",
    BMI: 23.77,
    age: 32,
    birthday: "1985-08-09T00:00:00.000Z",
    city: "West Josiemouth",
    married: false,
    index: 6
  }
];
let width = 700,
  height = 300,
  margins = {left: 100, right: 100, top: 50, bottom: 50},
  title = "User sample",
  // chart series,
  // field: is what field your data want to be selected
  // name: the name of the field that display in legend
  // color: what color is the line
  chartSeries = [
    {
      field: 'BMI',
      name: 'BMI',
      color: '#ff7f0e'
    }
  ],
  fillColor = colors.primaryGraphColor;
// your x accessor
var x = (d) => {
  return d.index;
};
class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }  

  render() {
    return (
      <div className="Charts content-container">
        <div className="title-container">
          <h2 className="title">Charts</h2>
        </div>
        <BarChart width={width} height={height} data={chartData} margin={margins} >
            <Bar name="BMI" type="monotone" dataKey="BMI" stroke={fillColor} fillOpacity={0.1} fill={fillColor} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Legend verticalAlign="top" height={30} />
            <XAxis dataKey="name" />
            <YAxis domain={['auto', 'auto']} />
          </BarChart>
      </div>
    );
  }
};

export default AuthenticatedPage(Charts);

