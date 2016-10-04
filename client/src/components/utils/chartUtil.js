import colors from './colors.js';

/* HANDY DATE NUMBERS */

var oneSecond = 1000;
var oneMinute = oneSecond * 60;
var oneHour = oneMinute * 60;
var oneDay = oneHour * 24;
var oneWeek = oneDay * 7;

/* HEALTHEVENT */
function makeHealthEventChartData(healthEvents) {
  //compute data
  let twoWeeksAgo = new Date(findNewestDate(healthEvents) - (1000*60*60*24*15))
    , datasets = []
    , currentDataSet = -1
    , key = '';
    
  let demoHealthEvents = healthEvents.filter(healthEv => healthEv.isDemo);
  let newestDemoDate = new Date(findNewestDate(demoHealthEvents));
  let demoDateOffset = ((new Date()).getTime() - newestDemoDate.getTime()) - 1000*3600*2; //newest demo is 2 hours ago

  if(healthEvents && healthEvents.length > 0) {
    for (var i = 0; i < healthEvents.length; i++){
      let he = healthEvents[i];
      /*if (new Date(he.date) < twoWeeksAgo) {
        continue;
      }*/

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

  datasets[0].data.sort(function(a, b){
    if (a.x < b.x) 
      return 1;
    if (a.x > b.x)
      return -1;
    return 0;
  })

  return {
    datasets: formatDatasets(datasets, 'Intensity')
  };
}

/* EXERCISE */
function avgValueForExercise(exercise) {
  if (exercise.reps.length > 0) {
    let avg = 0;
    for(var i = 0; i < exercise.reps.length; i++){
      avg += exercise.reps[i].value / exercise.reps.length;
    }
    return Math.round(avg);
  }
  else{
    return 0;
  }
}

function makeExerciseChartData(exercises) {
  //compute just what Chart.js needs in terms of data
  let twoWeeksAgo = new Date(findNewestDate(exercises) - (1000*60*60*24*15))
    , datasets = []
    , currentDataSet = -1
    , key = '';

  if(exercises && exercises.length > 0) {
    for (var i = 0; i < exercises.length; i++){
      let ex = exercises[i];
      if (new Date(ex.date) < twoWeeksAgo) {
        continue;
      }

      key = ex.type;
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

      if (ex.reps.length > 0) {
        datasets[currentDataSet].data.push({
          x: toMilliseconds(ex.date),
          y: avgValueForExercise(ex)
        });
      } 
    }
  }

  return {
    datasets: formatDatasets(datasets, 'Degrees')
  };
}

/* REPS */
function makeRepChartData(exercise) {
  //compute data
  let datasets = [{ data: [], label: '' }]
    , labels = [];

  if (exercise) {
    datasets[0].label = exercise.type;

    if (exercise.reps.length > 0){
      exercise.reps.forEach((rep, i) => {
        labels.push( 'Rep '+(i+1)+'' );
        datasets[0].data.push( Math.round(rep.value) );
      })
    }
  }

  return {
    labels: labels,
    datasets: formatDatasets(datasets, 'Degrees')
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
    d.exposedName = d.label;
    d.label = addToLabel ? addToLabel+' ('+d.label+')' : d.label;
    d.borderColor = colors.getGraphColor(i);
    d.backgroundColor = colors.getGraphColor(i, 'faded');
    d.pointRadius = 6;
    d.pointHoverRadius = 10;
    d.pointBackgroundColor = colors.getGraphColor(i);
    d.pointBorderColor = colors.getColor('blue');
    d.pointBorderWidth = 4;
    d.lineTension = d.exposedName == 'Sharp Pain' ? 0 : 0.5;

    return d;
  })
}

/* CHART OPTIONS */

var callbacks = {
  makeTitleIntoDate: (arr, data) => {
    let d = new Date(arr[0].xLabel);
    var month = d.toLocaleDateString('en-us', {month: 'long'});
    return month+' '+d.getDate()+', '+d.getFullYear()+' '+d.toLocaleTimeString();
  },

  makeTitleIntoDay: (arr, data) => {
    let d = new Date(arr[0].xLabel);
    var month = d.toLocaleDateString('en-us', {month: 'long'});
    return month+' '+d.getDate()+', '+d.getFullYear();
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
  return time.getTime() - 8 * oneDay;
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

var tooltips = {
  titleFontColor: colors.getFontColor('white'),
  bodyFontColor: colors.getFontColor('white'),
  backgroundColor: colors.getColor('purple'),
  xPadding: 15,
  yPadding: 15,
  titleMarginBottom: 10,
  titleFontSize: 16,
  bodyFontSize: 14,
  cornerRadius: 10
}

/* UTILITY FUNCTIONS */

function toMilliseconds(date) {
  date = new Date(date);
  return date.getTime();
}

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
  makeExerciseChartData: makeExerciseChartData,
  makeRepChartData: makeRepChartData,
  makeHeartRateChartData: makeHeartRateChartData,
  makeActivityChartData: makeActivityChartData,

  callbacks: callbacks,
  legends: legends,
  axes: axes,
  tooltips: tooltips,
  chartHeight: 270
}