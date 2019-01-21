(function () {
  Date.prototype.toSQL = Date_toYMD;

  function Date_toYMD() {
    var year, month, day, hour, minute, second;
    year = String(this.getFullYear());
    month = String(this.getMonth() + 1);
    if (month.length == 1) {
      month = "0" + month;
    }
    day = String(this.getDate());
    if (day.length == 1) {
      day = "0" + day;
    }
    hour = String(this.getHours());
    if (hour.length == 1) {
      hour = "0" + hour;
    }
    minute = String(this.getMinutes());
    if (minute.length == 1) {
      minute = "0" + minute;
    }
    second = String(this.getSeconds());
    if (second.length == 1) {
      second = "0" + second;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + ".0";
  }
})();

function getData() {
  return [
    ['1', 3.6, .5],
    ['2', 7.1, .1],
    ['3', 8.5, .5],
    ['4', 9.2, 8.9],
    ['5', 10.1, 20.8],
    ['6', 11.6, 22.9],
    ['7', 16.4, 25.2],
    ['8', 18.0, 27.0],
    ['9', 13.2, 26.5],
    ['10', 12.0, 25.3],
    ['12', 3.2, 23.4],
    ['13', 4.1, 19.5],
    ['14', 6.3, 17.8],
    ['16', 9.4, 16.2],
    ['17', 11.5, 15.4],
    ['18', 13.5, 14.0],
    ['19', 14.8, 12.5],
    ['20', 16.6, 10.8],
    ['21', 18.1, 8.9],
    ['22', 17.0, 8.0],
    ['23', 16.6, 6.2],
    ['24', 14.1, 5.1],
    ['25', 15.7, 3.7],
    ['26', 12.0, 1.5]
  ]
}
anychart.onDocumentReady(function () {
  // create data set on our data



  var dataSet = anychart.data.set(getData());

  // map data for the first series, take x from the zero column and value from the first column of data set
  var seriesData_1 = dataSet.mapAs({
    'x': 0,
    'value': 1
  });

  // map data for the second series, take x from the zero column and value from the second column of data set
  var seriesData_2 = dataSet.mapAs({
    'x': 0,
    'value': 2
  });

  // map data for the third series, take x from the zero column and value from the third column of data set
  var seriesData_3 = dataSet.mapAs({
    'x': 0,
    'value': 3
  });

  // create line chart
  var chart = anychart.line();

  // turn on chart animation
  chart.animation(true);

  // set chart padding
  chart.padding([10, 20, 5, 20]);

  // turn on the crosshair
  chart.crosshair()
    .enabled(true)
    .yLabel(false)
    .yStroke(null);

  // set tooltip mode to point
  chart.tooltip().positionMode('point');

  // set chart title text settings
  chart.title('Statistics');

  // set yAxis title
  chart.xAxis().labels().padding(5);

  // create first series with mapped data
  var series_1 = chart.line(seriesData_1);
  series_1.name('Spend money');
  series_1.hovered().markers()
    .enabled(true)
    .type('circle')
    .size(4);
  series_1.tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

  // create second series with mapped data
  var series_2 = chart.line(seriesData_2);
  series_2.name('Next day limit');
  series_2.hovered().markers()
    .enabled(true)
    .type('circle')
    .size(4);
  series_2.tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

  // create third series with mapped data


  // turn the legend on
  chart.legend()
    .enabled(true)
    .fontSize(13)
    .padding([0, 0, 10, 0]);

  // set container id for the chart
  chart.container('statistics');
  // initiate chart drawing
  chart.draw();
});
var evaluation = [];
jQuery(function ($) {
  function update() {
    let total = 0;
    evaluation.forEach(element => {
      total+=element;
    });
    total = parseInt($("#wishlist_without").val().split(' ')[0]) - total;
    $("#wishlist_with").val(total.toFixed(2) + " € ");
  }
  /*==================================================================
  [ Focus input ]*/
  $('.input100').each(function () {
    $(this).on('blur', function () {
      if ($(this).val().trim() != "") {
        $(this).addClass('has-val');
      } else {
        $(this).removeClass('has-val');
      }
    })
  })
  $("input[name='wishlistCheck[]']").click(function () {
    let element = JSON.parse($(this).val());
    if ($(this)[0].checked == true) {
      let date = new Date();
      let date_to = new Date(element.date);
      let diff = date_to.getTime() - date.getTime();
      diff = diff / 1000 / 60 / 60 / 24;
      diff = Math.round(diff);
      if (diff > 0)
        evaluation[element.id] = element.value / diff;
      else
        evaluation[element.id] = 0;
    } else
      evaluation[element.id] = 0;
    update();
  });
});
$(function () {
  // **********************************
  //  Description of ALL pager options
  // **********************************
  var pagerOptions = {
    container: $("#wishlist-pager"),
    ajaxUrl: null,
    customAjaxUrl: function (table, url) {
      return url;
    },
    ajaxError: null,
    ajaxObject: {
      dataType: 'json'
    },
    ajaxProcessing: null,
    processAjaxOnInit: true,
    output: '{startRow:input} – {endRow} / {totalRows} rows',
    updateArrows: true,
    page: 0,
    size: 10,
    savePages: true,
    storageKey: 'tablesorter-pager',
    pageReset: 0,
    fixedHeight: true,
    removeRows: false,
    countChildRows: false,
    cssNext: '.next', // next page arrow
    cssPrev: '.prev', // previous page arrow
    cssFirst: '.first', // go to first page arrow
    cssLast: '.last', // go to last page arrow
    cssGoto: '.gotoPage', // select dropdown to allow choosing a page
    cssPageDisplay: '.pagedisplay', // location of where the "output" is displayed
    cssPageSize: '.pagesize', // page size selector - select dropdown that sets the "size" option
    // class added to arrows when at the extremes (i.e. prev/first arrows are "disabled" when on the first page)
    cssDisabled: 'disabled', // Note there is no period "." in front of this class name
    cssErrorRow: 'tablesorter-errorRow' // ajax error information row
  };

  $("#wishlist-table")
    .tablesorter({
      widthFixed: true,
      widgets: ['zebra']
    }).tablesorterPager(pagerOptions);

  //pagerOptions.container = $("#monthly-income-pager");

});