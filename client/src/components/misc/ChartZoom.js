// hammer JS for touch support
var Hammer = require('hammerjs'); 
Hammer = typeof(Hammer) === 'function' ? Hammer : window.Hammer;

// Get the chart variable
var Chart = require('chart.js');
Chart = typeof(Chart) === 'function' ? Chart : window.Chart;
var helpers = Chart.helpers;

// Take the zoom namespace of Chart
var zoomNS = Chart.Zoom = Chart.Zoom || {};

// Where we store functions to handle different scale types
var zoomFunctions = zoomNS.zoomFunctions = zoomNS.zoomFunctions || {};
var panFunctions = zoomNS.panFunctions = zoomNS.panFunctions || {}; 

// Default options if none are provided
var defaultOptions = zoomNS.defaults = {
  pan: {
    enabled: true,
    mode: 'xy',
    threshold: 10,
  },
  zoom: {
    enabled: true,
    mode: 'xy',
  }
};

function directionEnabled(mode, dir) {
  if (mode === undefined) {
    return true;
  } else if (typeof mode === 'string') {
    return mode.indexOf(dir) !== -1;
  }

  return false;
}

function zoomIndexScale(scale, zoom, center) {

}

function zoomTimeScale(scale, zoom, center) {
  var options = scale.options;
  
  var range;
  var min_percent;
  if (scale.isHorizontal()) {
    range = scale.right - scale.left;
    min_percent = (center.x - scale.left) / range;
  } else {
    range = scale.bottom - scale.top;
    min_percent = (center.y - scale.top) / range;
  }

  var max_percent = 1 - min_percent;
  var newDiff = range * (zoom - 1);

  var minDelta = newDiff * min_percent;
  var maxDelta = newDiff * max_percent;

  options.time.min = scale.getValueForPixel(scale.getPixelForValue(scale.firstTick) + minDelta);
  options.time.max = scale.getValueForPixel(scale.getPixelForValue(scale.lastTick) - maxDelta);
}

function zoomNumericalScale(scale, zoom, center) {
  var range = scale.max - scale.min;
  var newDiff = range * (zoom - 1);

  var cursorPixel = scale.isHorizontal() ? center.x : center.y;
  var min_percent = (scale.getValueForPixel(cursorPixel) - scale.min) / range;
  var max_percent = 1 - min_percent;

  var minDelta = newDiff * min_percent;
  var maxDelta = newDiff * max_percent;

  scale.options.ticks.min = scale.min + minDelta;
  scale.options.ticks.max = scale.max - maxDelta;
}

function zoomScale(scale, zoom, center) {
  var fn = zoomFunctions[scale.options.type];
  if (fn) {
    fn(scale, zoom, center);
  }
}

function doZoom(chartInstance, zoom, center) {
  var ca = chartInstance.chartArea;
  if (!center) {
    center = {
      x: (ca.left + ca.right) / 2,
      y: (ca.top + ca.bottom) / 2,
    };
  }

  var zoomOptions = chartInstance.options.zoom;

  if (zoomOptions && helpers.getValueOrDefault(zoomOptions.enabled, defaultOptions.zoom.enabled)) {
    // Do the zoom here
    var zoomMode = helpers.getValueOrDefault(chartInstance.options.zoom.mode, defaultOptions.zoom.mode);

    helpers.each(chartInstance.scales, function(scale, id) {
      if (scale.isHorizontal() && directionEnabled(zoomMode, 'x')) {
        zoomScale(scale, zoom, center);
      } else if (directionEnabled(zoomMode, 'y')) {
        // Do Y zoom
        zoomScale(scale, zoom, center);
      }
    });

    chartInstance.update(0);
  }
}

function panIndexScale(scale, delta) {
  /*var options = scale.options;
  var labels = scale.chart.data.labels;
  var lastLabelIndex = labels.length - 1;

  var minIndex = Math.max(0, Math.round(scale.getValueForPixel(scale.getPixelForValue(null, scale.minIndex, null, true) - delta)));
  var maxIndex = Math.min(lastLabelIndex, Math.round(scale.getValueForPixel(scale.getPixelForValue(null, scale.maxIndex, null, true) - delta)))
  options.ticks.min = labels[minIndex];
  options.ticks.max = labels[maxIndex];*/
}

function scrollingPastEndOfData(scale, delta, extrema) {
  if (delta < 0 && scale.lastTick > extrema.max) {
    return true;
  }
  else if (delta > 0 && scale.firstTick < extrema.min) {
    return true;
  }

  return false;
}

function panTimeScale(scale, delta, extrema) {
  var options = scale.options;
  if (!scrollingPastEndOfData(scale, delta, extrema)) {
    options.time.min = scale.getValueForPixel(scale.getPixelForValue(scale.firstTick) - delta);
    options.time.max = scale.getValueForPixel(scale.getPixelForValue(scale.lastTick) - delta);
  }
}

function panNumericalScale(scale, delta) {
  var tickOpts = scale.options.ticks;
  var start = scale.start,
    end = scale.end;

  if (tickOpts.reverse) {
    tickOpts.max = scale.getValueForPixel(scale.getPixelForValue(start) - delta);
    tickOpts.min = scale.getValueForPixel(scale.getPixelForValue(end) - delta);
  } else {
    tickOpts.min = scale.getValueForPixel(scale.getPixelForValue(start) - delta);
    tickOpts.max = scale.getValueForPixel(scale.getPixelForValue(end) - delta);
  }
}

function panScale(scale, delta, extrema) {
  var fn = panFunctions[scale.options.type];
  if (fn) {
    fn(scale, delta, extrema);
  }
}

function getMinMax(datasets) {
  var xDataMin = Infinity;
  var xDataMax = -Infinity;
  var yDataMin = Infinity;
  var yDataMax = -Infinity;

  var data;
  for (var j = 0, lenj = datasets.length; j < lenj; j++) {
    data = datasets[j].data;

    for (var i = 0, len = data.length; i < len; i++) {
      var point = data[i];

      if (point.x < xDataMin)
        xDataMin = point.x;

      if (point.x > xDataMax)
        xDataMax = point.x;

      if (point.y < yDataMin)
        yDataMin = point.y;

      if (point.y > yDataMax)
        yDataMax = point.y;
    }
  }

  return { xDataMin, xDataMax, yDataMin, yDataMax };
}

function doPan(chartInstance, deltaX, deltaY) {
  var panOptions = chartInstance.options.pan;
  var chartData = chartInstance.data;
  var extrema = getMinMax(chartData.datasets);

  if (panOptions && helpers.getValueOrDefault(panOptions.enabled, defaultOptions.pan.enabled)) {
    var panMode = helpers.getValueOrDefault(chartInstance.options.pan.mode, defaultOptions.pan.mode);

    helpers.each(chartInstance.scales, function(scale, id) {
      if (scale.isHorizontal() && directionEnabled(panMode, 'x') && deltaX !== 0) {
        panScale(scale, deltaX, { min: extrema.xDataMin, max: extrema.xDataMax });
      } else if (!scale.isHorizontal() && directionEnabled(panMode, 'y') && deltaY !== 0) {
        panScale(scale, deltaY, extrema);
      }
    });

    chartInstance.update(0);
  }
}

function getYAxis(chartInstance) {
  var scales = chartInstance.scales;
  
  for (var scaleId in scales) {
    if (scales.hasOwnProperty(scaleId)){
      var scale = scales[scaleId];
      
      if (!scale.isHorizontal()) {
        return scale;
      }
    }
  }
}

// Store these for later
zoomNS.zoomFunctions.category = zoomIndexScale;
zoomNS.zoomFunctions.time = zoomTimeScale;
zoomNS.zoomFunctions.linear = zoomNumericalScale;
zoomNS.zoomFunctions.logarithmic = zoomNumericalScale;
zoomNS.panFunctions.category = panIndexScale;
zoomNS.panFunctions.time = panTimeScale;
zoomNS.panFunctions.linear = panNumericalScale;
zoomNS.panFunctions.logarithmic = panNumericalScale;

// Chartjs Zoom Plugin
var zoomPlugin = {
  afterInit: function(chartInstance) {
    helpers.each(chartInstance.scales, function(scale) {
      scale.originalOptions = JSON.parse(JSON.stringify(scale.options));
    });
    
    chartInstance.resetZoom = function() {
      helpers.each(chartInstance.scales, function(scale, id) {
        var timeOptions = scale.options.time;
        var tickOptions = scale.options.ticks;
        
        if (timeOptions) {
          delete timeOptions.min;
          delete timeOptions.max;
        }
        
        if (tickOptions) {
          delete tickOptions.min;
          delete tickOptions.max;
        }
        
        scale.options = helpers.configMerge(scale.options, scale.originalOptions);
      });
      
      helpers.each(chartInstance.data.datasets, function(dataset, id) {
        dataset._meta = null;
      });
      
      chartInstance.update();
    };

  },
  beforeInit: function(chartInstance) {
    var node = chartInstance.chart.ctx.canvas;
    var options = chartInstance.options;
    var panThreshold = helpers.getValueOrDefault(options.pan ? options.pan.threshold : undefined, zoomNS.defaults.pan.threshold);

    if (options.zoom && options.zoom.drag) {
      // Only want to zoom horizontal axis
      options.zoom.mode = 'x';
      
      node.addEventListener('mousedown', function(event){
        chartInstance._dragZoomStart = event;
      });
      
      node.addEventListener('mousemove', function(event){
        if (chartInstance._dragZoomStart) {
          chartInstance._dragZoomEnd = event;
          chartInstance.update(0);
        }
        
        chartInstance.update(0);
      });
      
      node.addEventListener('mouseup', function(event){
        if (chartInstance._dragZoomStart) {
          var chartArea = chartInstance.chartArea;
          var yAxis = getYAxis(chartInstance);
          var beginPoint = chartInstance._dragZoomStart;
          var startX = Math.min(beginPoint.x, event.x) ;
          var endX = Math.max(beginPoint.x, event.x);
          var dragDistance = endX - startX;
          var chartDistance = chartArea.right - chartArea.left;
          var zoom = 1 + ((chartDistance - dragDistance) / chartDistance );
          
          if (dragDistance > 0) {
            doZoom(chartInstance, zoom, {
              x: (dragDistance / 2) + startX,
              y: (yAxis.bottom - yAxis.top) / 2,
            });
          }
          
          chartInstance._dragZoomStart = null;
          chartInstance._dragZoomEnd = null;
        }
      });
    }
    else {
      var wheelHandler = function(e) {
        var rect = e.target.getBoundingClientRect();
        var offsetX = e.clientX - rect.left;
        var offsetY = e.clientY - rect.top;
  
        var center = {
          x : offsetX,
          y : offsetY
        };
  
        if (e.deltaY < 0) {
          doZoom(chartInstance, 1.1, center);
        } else {
          doZoom(chartInstance, 0.909, center);
        }
      };
      chartInstance._wheelHandler = wheelHandler;
      
      node.addEventListener('wheel', wheelHandler);
    }

    if (Hammer) {
      var mc = new Hammer.Manager(node);
      mc.add(new Hammer.Pinch());
      mc.add(new Hammer.Pan({
        threshold: panThreshold
      }));

      // Hammer reports the total scaling. We need the incremental amount
      var currentPinchScaling;
      var handlePinch = function handlePinch(e) {
        var diff = (1 / currentPinchScaling) * e.scale;
        doZoom(chartInstance, diff, e.center);

        // Keep track of overall scale
        currentPinchScaling = e.scale;
      };
      
      mc.on('pinchstart', function(e) {
        currentPinchScaling = 1; // reset tracker
      });
      mc.on('pinch', handlePinch);
      mc.on('pinchend', function(e) {
        handlePinch(e);
        currentPinchScaling = null; // reset
      });

      var currentDeltaX = null, currentDeltaY = null;
      var handlePan = function handlePan(e) {
        if (currentDeltaX !== null && currentDeltaY !== null) {
          var deltaX = e.deltaX - currentDeltaX;
          var deltaY = e.deltaY - currentDeltaY;
          currentDeltaX = e.deltaX;
          currentDeltaY = e.deltaY;

          doPan(chartInstance, deltaX, deltaY);
        }
      };

      mc.on('panstart', function(e) {
        currentDeltaX = 0;
        currentDeltaY = 0;
        handlePan(e);
      });
      mc.on('panmove', handlePan);
      mc.on('panend', function(e) {
        currentDeltaX = null;
        currentDeltaY = null;
      });
      chartInstance._mc = mc;
    }
  },

  beforeDatasetsDraw: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    var chartArea = chartInstance.chartArea;
    ctx.save();
    ctx.beginPath();
    
    if (chartInstance._dragZoomEnd) {
      var yAxis = getYAxis(chartInstance);
      var beginPoint = chartInstance._dragZoomStart;
      var endPoint = chartInstance._dragZoomEnd;
      var startX = Math.min(beginPoint.x, endPoint.x);
      var endX = Math.max(beginPoint.x, endPoint.x);
      var rectWidth = endX - startX;
    
      
      ctx.fillStyle = 'rgba(225,225,225,0.3)';
      ctx.lineWidth = 5;
      ctx.fillRect(startX, yAxis.top, rectWidth, yAxis.bottom - yAxis.top);
    }
    
    ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    ctx.clip();
  },

  afterDatasetsDraw: function(chartInstance) {
    chartInstance.chart.ctx.restore();
  },

  destroy: function(chartInstance) {
    var node = chartInstance.chart.ctx.canvas;
    node.removeEventListener('wheel', chartInstance._wheelHandler);

    var mc = chartInstance._mc;
    if (mc) {
      mc.remove('pinchstart');
      mc.remove('pinch');
      mc.remove('pinchend');
      mc.remove('panstart');
      mc.remove('pan');
      mc.remove('panend');
    }
  }
};

Chart.pluginService.register(zoomPlugin);
