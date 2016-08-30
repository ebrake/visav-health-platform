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
    return Number(avg.toFixed(2));
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

      //FUTURE US, YOUR ISSUE WAS CAUSED BY THIS SLICE!!!!
      key = ex.type.slice(10);
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
    datasets[0].label = exercise.type.slice(10);

    if (exercise.reps.length > 0){
      exercise.reps.forEach((rep, i) => {
        labels.push( 'Rep '+i+'' );
        datasets[0].data.push( Number(rep.value.toFixed(2)) );
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

  makeTitleIntoDate: (arr, data) => {
    let d = new Date(arr[0].xLabel);
    return d.toLocaleDateString()+' '+d.toLocaleTimeString();
  }
}