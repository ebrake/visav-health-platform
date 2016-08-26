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

var toLocaleDateString = (date) => {
  date = new Date(date);
  return date.toLocaleDateString();
}

var findNewestDate = (array) => {
  var retDate = new Date(0);
  array.forEach(item => {
    if (new Date(item.date) > retDate) {
      retDate = new Date(item.date);
    } else {
      console.log('Huh?');
      console.log(item.date);
      console.log(retDate);
    }
  })

  return retDate;
}

var includes = (array, day, month) => {
  for (var i = 0; i < array.length; i++) {
    if (array[i].day == day && array[i].month == month) return true;
  }

  return false;
}

var sortByDate = (dataArray) => {
  var retArray = [];
  while (dataArray.length){
    var minDate = new Date(), minIndex = -1;
    for (var i = 0; i < dataArray.length; i++) {
      if (new Date(dataArray[i].date) < minDate) {
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
  var lastDay = lastDate.getDate();
  var lastMonth = lastDate.getMonth();

  for (var i = 1; i < 15; i++) {
    lastDay--;
    if (lastDay < 1) {
      lastMonth--;
      lastDay = months[lastMonth].days;
    }
    if (!includes(dataArray, lastDay, lastMonth)) {
      dataArray.push({
        swelling: 0,
        pain: 0,
        date: toLocaleDateString('2016-'+(lastMonth+1)+'-'+(lastDay)),
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
      if (he.type.toLowerCase() == 'swelling') {
        dataPoint['swelling'] = Math.round(he.intensity*10);
        dataPoint['pain'] = 0;
      } else {
        dataPoint['pain'] = Math.round(he.intensity*10);
        dataPoint['swelling'] = 0;
      }
      dataPoint['date'] = toLocaleDateString(he.date);
      dataPoint['name'] = he.type;

      var heDate = new Date(he.date);
      dataPoint.month = heDate.getMonth();
      dataPoint.day = heDate.getDate();

      dataArray.push(dataPoint);
    }
  }

  return addEmptyDaysToHealthEventChartData(dataArray);
}

var addEmptyDaysToExerciseChartData = (dataArray) => {
  var lastDate = findNewestDate(dataArray);
  var lastDay = lastDate.getDate();
  var lastMonth = lastDate.getMonth();

  for (var i = 1; i < 15; i++) {
    lastDay--;
    if (lastDay < 1) {
      lastMonth--;
      lastDay = months[lastMonth].days;
    }
    if (!includes(dataArray, lastDay, lastMonth)) {
      dataArray.push({
        value: 0,
        unit: 'degrees',
        date: toLocaleDateString('2016-'+(lastMonth+1)+'-'+(lastDay)),
        name: '-'
      })
    }
  }

  return sortByDate(dataArray);
}

var formatExerciseChartData = (exercises) => {
  let twoWeeksAgo = new Date(findNewestDate(exercises) - 1000*60*60*24*15)
    , dataArray = [];

  if(exercises && exercises.length > 0) {
    for (var i = 0; i < exercises.length; i++){
      var ex = exercises[i];
      if (new Date(ex.date) < twoWeeksAgo) {
        continue;
      }

      let dataPoint = {};
      if (ex.reps.length > 0) {
        dataPoint['value'] = Math.round(this.avgValueForExercise(ex));
        dataPoint['unit'] = ex.reps[0].unit; //assumes all reps have same unit for one exercise
      } else {
        dataPoint['value'] = 0;
        dataPoint['unit'] = 'NO REPS';
      }
      dataPoint['date'] = toLocaleDateString(ex.date);
      dataPoint['name'] = ex.type;

      var exDate = new Date(ex.date);
      dataPoint.month = exDate.getMonth();
      dataPoint.day = exDate.getDate();

      if (dataPoint.unit != 'NO REPS')
        dataArray.push(dataPoint);
    }
  }

  return dataArray;
  //return addEmptyDaysToExerciseChartData(dataArray);
}

export default {
  makeHealthEventChartData: (healthEvents) => {
    return formatHealthEventChartData(healthEvents);
  },

  makeExerciseChartData: (exercises) => {
    return formatExerciseChartData(exercises);
  }
}