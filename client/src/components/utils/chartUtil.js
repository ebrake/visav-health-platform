import colors from './colors.js';

/* HANDY DATE NUMBERS */

var oneSecond = 1000;
var oneMinute = oneSecond * 60;
var oneHour = oneMinute * 60;
var oneDay = oneHour * 24;

/* HEALTHEVENT */
function makeHealthEventChartData(healthEvents) {
  //compute data
  let datasets = []
    , currentDataSet = -1
    , key = '';
    
  let demoHealthEvents = healthEvents.filter(healthEv => healthEv.isDemo);
  let newestDemoDate = new Date(findNewestDate(demoHealthEvents));
  let demoDateOffset = ((new Date()).getTime() - newestDemoDate.getTime()) - (oneHour*2); //newest demo is 2 hours ago

  if(healthEvents && healthEvents.length > 0) {
    for (var i = 0; i < healthEvents.length; i++){
      let he = healthEvents[i];

      //key = he.type;
      key = 'Sharp Pain';

      currentDataSet = -1;

      for (var j = 0; j < datasets.length; j++) {
        if (datasets[j].label === key) {
          currentDataSet = j;
        }
      } 

      if (currentDataSet < 0) {
        currentDataSet = datasets.length;
        datasets.push({ label: key, data: [] });
      }

      let adjustedDateMillis = he.isDemo ? (new Date(he.date)).getTime() + demoDateOffset : (new Date(he.date)).getTime();

      datasets[currentDataSet].data.push({
        x: adjustedDateMillis,
        y: Math.round(he.intensity*10),
        type: he.type
      });
    }
  }

  if (datasets && datasets[0]) {
    datasets[0].data.sort(function(a, b){
      if (a.x < b.x) 
        return 1;
      if (a.x > b.x)
        return -1;
      return 0;
    })
  }

  return {
    datasets: formatDatasets(datasets, 'Intensity')
  };
}

function makeHeartRateChartData(HeartRateData) {
  let datasets = [{ data: [], label: 'Heart Rate' }];

  var d = new Date();
  d.setHours(0, 0, 0, 0);

  var day, hours, minutes, seconds;

  for (var i = 0; i < 30; i++) {
    d = new Date(d - oneDay)

    hours = 8 + Math.round(Math.random()*11);
    minutes = Math.round(Math.random()*60);
    seconds = Math.round(Math.random()*60);

    day = new Date(d);
    day.setHours(hours, minutes, seconds);

    datasets[0].data.push({
      x: day.getTime(),
      y: 60+Math.round(Math.random()*25) + (Math.random() > 0.7 ? Math.round(Math.random()*40) : 0)
    })
  }

  return {
    datasets: formatDatasets(datasets)
  }
}

function makeActivityChartData(activityData) {
  let datasets = [{ data: [], label: 'Steps' }];

  var d = new Date();
  d.setHours(0, 0, 0, 0);

  datasets[0].data.push({
    x: d.getTime(),
    y: 1000 + Math.round(Math.random()*3000)
  })

  for (var i = 0; i < 30; i++) {
    d = new Date(d - oneDay);

    datasets[0].data.push({
      x: d.getTime(),
      y: 3000 + Math.round(Math.random()*5000)
    })
  }

  return {
    datasets: formatDatasets(datasets)
  }
}

/* DATASET FORMATTER */
function formatDatasets(datasets, addToLabel) {
  return datasets.map((d, i) => {
    d.borderColor = colors.getGraphColor(i);
    d.backgroundColor = colors.getGraphColor(i, 'faded');
    d.pointRadius = 6;
    d.pointHoverRadius = 10;
    d.pointBackgroundColor = colors.getGraphColor(i);
    d.pointBorderColor = colors.getColor('blue');
    d.pointBorderWidth = 4;
    d.lineTension = d.label === 'Sharp Pain' ? 0 : 0.5;

    return d;
  })
}

/* CHART OPTIONS */

var formatters = {
  getDateString: (date) => {
    var month = date.toLocaleDateString([], {month: 'long'});
    return month+' '+date.getDate()+', '+date.getFullYear();
  },

  getTimeString: (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

var legends = {
  defaultLegend: {
    display: false
  }
}

function getMaxTime() {
  var time = new Date();
  time.setHours(0, 0, 0, 0);
  return time.getTime();
}

function getMinTime() {
  var time = new Date();
  time.setHours(0, 0, 0, 0);
  return time.getTime() - (8 * oneDay);
}

var axes = {
  timeXAxes: [{
    type: 'time',
    time: {
      displayFormats: {
        day: 'MMM D'
      },
      unit: 'day',
      min: getMinTime(),
      max: getMaxTime()
    },
    position: 'bottom',
    ticks: {
      fontColor: colors.getFontColor('light'),
      maxRotation: 0,
      minRotation: 0
    },
    gridLines: {
      display: false
    },
    afterBuildTicks: function(scale) {
      scale.ticks = scale.ticks.slice(1);

      return scale;
    }
  }],

  categoryXAxes: [{
    type: 'category',
    position: 'bottom',
    ticks: {
      fontColor: colors.getFontColor('light')
    },
    gridLines: {
      display: false
    }
  }],

  defaultYAxes: [{
    ticks: {
      fontColor: colors.getFontColor('light'),
      maxTicksLimit: 3
    },
    gridLines: {
      display: false
    }
  }]
}

/* UTILITY FUNCTIONS */

function findNewestDate(array) {
  var retDate = new Date(0);
  array.forEach(item => {
    if (new Date(item.date) > retDate) {
      retDate = new Date(item.date);
    }
  })

  return retDate;
}

/* CHART UTIL */

export default {
  makeHealthEventChartData: makeHealthEventChartData,
  makeHeartRateChartData: makeHeartRateChartData,
  makeActivityChartData: makeActivityChartData,
  formatters: formatters,
  legends: legends,
  axes: axes,
}