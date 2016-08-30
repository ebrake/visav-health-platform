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
    return avg;
  }
  else{
    return 0;
  }
}

var formatExerciseChartData = (exercises, key) => {
  return {
    datasets: [{
      label: 'Scatter Dataset',
      data: [{
        x: -10,
        y: 0
      }, {
        x: 0,
        y: 10
      }, {
        x: 10,
        y: 5
      }]
    }]
  };


  let twoWeeksAgo = new Date(findNewestDate(exercises) - (1000*60*60*24*15))
    , dataArray = [];

  if(exercises && exercises.length > 0) {
    for (var i = 0; i < exercises.length; i++){
      var ex = exercises[i];
      if (new Date(ex.date) < twoWeeksAgo) {
        continue;
      }

      let dataPoint = {};

      if (ex.reps.length > 0 && getKey(ex) == key) {
        dataPoint['value'] = Math.round(avgValueForExercise(ex));
        dataPoint['unit'] = ex.reps[0].unit; //assumes all reps have same unit for one exercise
      } else {
        dataPoint['unit'] = 'NO REPS';
      }
      dataPoint['date'] = toMilliseconds(ex.date);
      dataPoint['name'] = ex.type;

      var d = new Date(ex.date);
      dataPoint.month = d.getMonth();
      dataPoint.day = d.getDate();

      if (dataPoint.unit !== 'NO REPS') {
        dataArray.push(dataPoint);
      }
    }
  }

  return dataArray;
}

export default {
  makeHealthEventChartData: (healthEvents) => {
    return formatHealthEventChartData(healthEvents);
  },

  makeExerciseChartData: (exercises, key) => {
    return formatExerciseChartData(exercises, key);
  },

  getKeysFor: (exercises) => {
    return getKeysFor(exercises);
  }
}