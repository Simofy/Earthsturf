var buildingId = 0;
var imageId = 0;
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

jQuery(function ($) {




  $("#toggle-option").click(function (e) {
    e.preventDefault();
    $("#toggle-option").toggleClass("cog-pressed");
    $("#wrapper").toggleClass("toggled");
    return false;
  });
  $('#option-acc-form').submit(function name(e) {
    if ($('#new_username').val() == "")
      e.preventDefault();
  });
  $('#option-acc-del-form').submit(function name(e) {
    if (!confirm('Do you really want to delete your account?\nAll the data will be lost!'))
      e.preventDefault();
  });
  $("#toggle-option-delete-account").click(function (e) {
    e.preventDefault();
    $("#option-acc-div").toggleClass("extra-toggled");
    return false;
  });

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
});


var map;

$(function () {


  mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltb2Z5IiwiYSI6ImNqZ2RxbTYyNTBzcmUycW54NTBndWttaGkifQ.DHN8biziVIwJcBsjzeBLeg';

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/simofy/cjidbocbw11j62sp8nxryh5ju',
    center: [25.279652, 54.687157],
    zoom: 12.00
  });
  map.addControl(new mapboxgl.NavigationControl());
  $("#toggle-option").click(function () {
    $("#toggle-option-div").toggle();
  });
  let drag_screen = false;
  $("#screen-resize").mouseover(function () {
    if (!leftButtonDown) drag_screen = true;
  });
  $("#screen-resize").mouseout(function () {
    if (!leftButtonDown) drag_screen = false;
  });

  var leftButtonDown = false;
  $(document).mousedown(function (e) {
    map.easeTo({animate:true, offset: [0, 0], duration: 100, easing: function (t) { return t * (2 - t); } });
    // Left mouse button was pressed, set flag
    if (e.which === 1) leftButtonDown = true;
  });
  $(document).mouseup(function (e) {
    // Left mouse button was released, clear flag
    if (e.which === 1) leftButtonDown = false;

    drag_screen = false;
    if (button_add_drag) {
      $("#a-blob").css("display", "none");
      buildingPlacedInfo.moving = false;


      if (moveOnMap) {
        data_to_send.push({
          color: data_from_server.options[0].color,
          buildingSize: buildingPlacedInfo.info.field,
          buildingLocation: JSON.stringify(mapMouseLonLat)
        });

        moveOnMap = false;
        let imageName = 'image_' + imageId++;
        if (!map.hasImage(imageName)) {


          let w = buildingPlacedInfo.info.field.split('x')[0] * 10;
          let h = buildingPlacedInfo.info.field.split('x')[1] * 10;
          // let x = e.point.x;
          // let y = e.point.y;
          let width = w; // The image will be 64 pixels square
          let bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
          let data = new Uint8Array(w * h * bytesPerPixel);
          console.log(data_from_server.options[0])
          let color = new RGBColor(data_from_server.options[0].color);
          for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
              let offset = (y * width + x) * bytesPerPixel;
              data[offset + 0] = color.r;
              data[offset + 1] = color.g;
              data[offset + 2] = color.b;
              data[offset + 3] = 255;
            }
          };
          map.addImage(imageName, {
            width: w,
            height: h,
            data: data
          });
        }
        let layerName = 'building_' + buildingId++;

        layerNames.push(layerName);

        map.addLayer({
          "id": layerName,
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": [{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [mapMouseLonLat.lng, mapMouseLonLat.lat]
                }
              }]
            }
          },
          "layout": {
            "icon-image": imageName
          }
        });

      }
    }
    button_add_drag = false;
  });

  $(document).mousemove(function (e) {
    if (e.which == 1 && drag_screen) {
      let x = e.pageX;
      let y = e.pageY;
      let w = $(window).width();
      let h = $(window).height();
      let left = Math.round((x / w) * 100);
      let right = 100 - left;
      if (left > 15 && left < 85) {
        $(".sectionCol-left").css('width', left + "%");
        $(".sectionCol-right").css('width', right + "%");
        $("#screen-resize").css('left', 'calc(' + left + "%" + " - 5px)");
        map.resize();
      }
      e.preventDefault();
    }
    if (e.which == 1 && button_add_drag && buildingPlacedInfo.moving) {
      $("#a-blob").css("display", "block");
      let w = buildingPlacedInfo.info.field.split('x')[0] * 10;
      let h = buildingPlacedInfo.info.field.split('x')[1] * 10;
      let x = e.pageX - w / 2;
      let y = e.pageY - h / 2;
      $("#a-blob").css("width", w + "px");
      $("#a-blob").css("height", h + "px");
      $("#a-blob").css("left", x + "px");
      $("#a-blob").css("top", y + "px");


      e.preventDefault();
    }

  });
  let moveOnMap = false;
  let mapMouseLonLat;
  map.on('mousemove', function (e) {
    moveOnMap = true;
    mapMouseLonLat = e.lngLat;
  });
  map.on('mouseover', function (e) {
    moveOnMap = true;
  });
  map.on('mouseout', function (e) {
    moveOnMap = false;
  });
  $("#buildings-offense-table")
    .tablesorter({
      widthFixed: true,
      widgets: ['zebra']
    });
  $("#buildings-defence-table")
    .tablesorter({
      widthFixed: true,
      widgets: ['zebra']
    });
  $("#buildings-main-table")
    .tablesorter({
      widthFixed: true,
      widgets: ['zebra']
    });
  let buildingPlacedInfo = {
    moving: false,
    info: {}
  };

  let button_add_drag = false;
  $('[name="element_id"]').mouseover(function () {
    if (!leftButtonDown) {
      button_add_drag = true;
      if (!buildingPlacedInfo.moving) {

        let b_id = $(this).val();
        for (let i = 0; i < data_from_server.buildings.length; i++) {
          if (b_id == data_from_server.buildings[i].building_id) {
            //check for total money
            buildingPlacedInfo.moving = true;
            buildingPlacedInfo.info = data_from_server.buildings[i];
          }
        }
      }
    }
  });
  $('[name="element_id"]').mouseout(function () {
    if (!leftButtonDown) {
      buildingPlacedInfo.moving = false;
      button_add_drag = false;
    }
  });
  $('[name="submit"]').click(function () {
    if(data_to_send.length > 0){

      socket.emit('sendNewData', data_to_send);
    }
    data_to_send = [];
  });
  $('[name="element_id"]').click(function () {
    // if (!buildingPlacedInfo.moving) {

    //   let b_id = $(this).val();
    //   for (let i = 0; i < data_from_server.buildings.length; i++) {
    //     if (b_id == data_from_server.buildings[i].building_id) {
    //       //check for total money
    //       buildingPlacedInfo.moving = true;
    //       buildingPlacedInfo.info = data_from_server.buildings[i];
    //     }
    //   }
    // }


  });

});
var data_to_send = [];