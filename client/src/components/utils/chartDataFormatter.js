import colors from './colors.js';

var months = [
  { name: 'January', month: 1, days: 31 },
  { name: 'February', month: 2, days: 28 },
  { name: 'March', month: 3, days: 31 },
  { name: 'April', month: 4, days: 30 },
  { name: 'May', month: 5, days: 31 },
  { name: 'June', month: 6, days: 30 },
  { name: 'July', month: 7, days: 31 },
  { name: 'August', month: 8, days: 31 },
  { name: 'September', month: 9, days: 30 },
  { name: 'October', month: 10, days: 31 },
  { name: 'November', month: 11, days: 30 },
  { name: 'December', month: 12, days: 31 }
];

var toMilliseconds = (date) => {
  date = new Date(date);
  return date.getTime();
}

var findNewestDate = (array) => {
  var retDate = new Date(0);
  array.forEach(item => {
    if (new Date(item.date) > retDate) {
      retDate = new Date(item.date);
    }
  })

  return retDate;
}

var getKey = (ex) => {
  return ex.type.slice(10);
}

var getKeysFor = (exercises) => {
  var retArray = [];
  exercises.forEach(ex =>{
    if (retArray.indexOf(getKey(ex)) < 0) 
      retArray.push(getKey(ex));
  })
  return retArray;
}

var arrayIncludesDate = (array, day, month) => {
  for (var i = 0; i < array.length; i++) {
    if (array[i].day === day && array[i].month === month) return true;
  }

  return false;
}

var sortByDate = (dataArray) => {
  var retArray = [];
  while (dataArray.length){
    var minDate = new Date(), minIndex = -1;
    for (var i = 0; i < dataArray.length; i++) {
      if (new Date(dataArray[i].date).getTime() < minDate.getTime()) {
        minDate = new Date(dataArray[i].date);
        minIndex = i;
      }
    }
    retArray.push(dataArray.splice(minIndex, 1)[0]);
  }
  return retArray;
}

var addEmptyDaysToHealthEventChartData = (dataArray) => {
  var lastDate = findNewestDate(dataArray);
  var day = lastDate.getDate()
    , month = lastDate.getMonth()
    , year = lastDate.getFullYear();

  for (var i = 1; i < 15; i++) {
    day--;
    if (day < 1) {
      month--;
      if (month < 0) {
        month = 11;
        year --;
      }
      day = months[month].days;
    }
    if (!arrayIncludesDate(dataArray, day, month)) {
      dataArray.push({
        swelling: 0,
        pain: 0,
        date: toMilliseconds(year+'-'+(month+1)+'-'+(day)),
        name: '-'
      })
    }
  }

  return sortByDate(dataArray);
}

var formatHealthEventChartData = (healthEvents) => {
  let twoWeeksAgo = new Date(findNewestDate(healthEvents) - (1000*60*60*24*15))
    , dataArray = [];

  if(healthEvents && healthEvents.length > 0) {
    for (var i = 0; i < healthEvents.length; i++){
      var he = healthEvents[i];
      if (new Date(he.date) < twoWeeksAgo) {
        continue;
      }

      let dataPoint = {};
      if (he.type.toLowerCase() === 'swelling') {
        dataPoint['swelling'] = Math.round(he.intensity*10);
        dataPoint['pain'] = 0;
      } else {
        dataPoint['pain'] = Math.round(he.intensity*10);
        dataPoint['swelling'] = 0;
      }
      dataPoint['date'] = toMilliseconds(he.date);
      dataPoint['name'] = he.type;

      var d = new Date(he.date);
      dataPoint.month = d.getMonth();
      dataPoint.day = d.getDate();

      dataArray.push(dataPoint);
    }
  }

  return addEmptyDaysToHealthEventChartData(dataArray);
}

var avgValueForExercise = (exercise) => {
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

var formatExerciseChartData = (exercises) => {
  //compute data
  var twoWeeksAgo = new Date(findNewestDate(exercises) - (1000*60*60*24*15))
    , datasets = []
    , currentDataSet = -1
    , key = '';

  if(exercises && exercises.length > 0) {
    for (var i = 0; i < exercises.length; i++){
      let ex = exercises[i];
      if (new Date(ex.date) < twoWeeksAgo) {
        continue;
      }

      key = getKey(ex);
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

  //configure datasets to have correct labels and colors
  datasets = datasets.map((d, i) =>{
    d.label = 'degrees ('+d.label+')';
    d.borderColor = colors.getGraphColor(i, 1);
    d.backgroundColor = colors.getGraphColor(i, 0.3);
    return d;
  })

  return {
    datasets: datasets
  };
}

export default {
  makeHealthEventChartData: (healthEvents) => {
    return formatHealthEventChartData(healthEvents);
  },

  makeExerciseChartData: (exercises) => {
    return formatExerciseChartData(exercises);
  },

  getKeysFor: (exercises) => {
    return getKeysFor(exercises);
  }
}