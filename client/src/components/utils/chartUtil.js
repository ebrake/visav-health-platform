import colors from './colors.js';

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

function makeHealthEventChartData(healthEvents) {
  //compute data
  let twoWeeksAgo = new Date(findNewestDate(healthEvents) - (1000*60*60*24*15))
    , datasets = []
    , currentDataSet = -1
    , key = '';

  if(healthEvents && healthEvents.length > 0) {
    for (var i = 0; i < healthEvents.length; i++){
      let he = healthEvents[i];
      if (new Date(he.date) < twoWeeksAgo) {
        continue;
      }

      key = he.type;
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

      datasets[currentDataSet].data.push({
        x: toMilliseconds(he.date),
        y: Math.round(he.intensity*10)
      });
    }
  }  

  //configure datasets to have correct labels and colors
  datasets = datasets.map((d, i) => {
    d.label = 'Intensity ('+d.label+')';
    d.borderColor = colors.getGraphColor(i, 1);
    d.backgroundColor = colors.getGraphColor(i, 0.3);
    return d;
  });

  return {
    datasets: datasets
  };
}

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

  //configure datasets to have correct labels and colors, add extra information
  datasets = datasets.map((d, i) => {
    d.label = 'Degrees ('+d.label+')';
    d.borderColor = colors.getGraphColor(i, 1);
    d.backgroundColor = colors.getGraphColor(i, 0.3);
    return d;
  });

  return {
    datasets: datasets
  };
}

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

  //configure datasets to have correct labels and colors
  datasets = datasets.map((d, i) => {
    d.label = 'Degrees ('+d.label+')';
    d.borderColor = colors.getGraphColor(i, 1);
    d.backgroundColor = colors.getGraphColor(i, 0.3);
    return d;
  });

  return {
    labels: labels,
    datasets: datasets
  };
}

var callbacks = {
  makeTitleIntoDate: (arr, data) => {
    let d = new Date(arr[0].xLabel);
    return d.toLocaleDateString()+' '+d.toLocaleTimeString();
  }
}

var legends = {
  defaultLegend: {
    display: false
  }
}

//need to pass it an ID so we know which chart to read off the window
var legendCallback = (chartId) => {
  return function(chart) {
    var datasets = chart.data.datasets
    , legend = chart.legend
    , generatedHTML = '<ul>';

    legend.legendItems.forEach((item, i) => {
      generatedHTML += 
      '<li id="'+chartId+i+'" onClick="globalChartLegendDatasetToggle(event, '+i+', \''+chartId+'\', '+chartId+i+')">'+
        '<div class="legend-point" style="background-color:'+datasets[i].backgroundColor+';border:3px solid '+datasets[i].borderColor+';"></div>'+
        '<span>'+item.text+'</span>'+
      '</li>';
    })

    generatedHTML += '</ul>';

    return generatedHTML;
  }
}

globalChartLegendDatasetToggle = function(e, datasetIndex, chartId, listElement) {
  var ci = e.view[chartId];
  var meta = ci.getDatasetMeta(datasetIndex);

  meta.hidden = meta.hidden === null? !ci.data.datasets[datasetIndex].hidden : null;

  ci.update();

  if (meta.hidden) listElement.className = 'toggled';
  else listElement.className = '';
};

var axes = {
  timeXAxes: [{
    type: 'time',
    time: {
      displayFormats: {
        day: 'MMM D'
      },
      unit: 'day'
    },
    position: 'bottom'
  }],

  categoryXAxes: [{
    type: 'category',
    position: 'bottom'
  }]
}

var tooltips = {
  titleFontColor: colors.getFontColor('light'),
  bodyFontColor: colors.getFontColor('light')
}

export default {
  makeHealthEventChartData: (healthEvents) => {
    return makeHealthEventChartData(healthEvents);
  },

  makeExerciseChartData: (exercises) => {
    return makeExerciseChartData(exercises);
  },

  makeRepChartData: (exercise) => {
    return makeRepChartData(exercise);
  },

  callbacks: callbacks,
  legends: legends,
  axes: axes,
  tooltips: tooltips,
  legendCallback: legendCallback,
  chartHeight: 270
}