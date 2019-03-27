$(function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    context: document.body,
    type: "POST",
    error: function (err) {
      
    }
  });
  socket = io.connect('http://localhost:3000/');
  socket.on('connect', function (data) {
    socket.emit('join', 'Connection successful.');
  });
  socket.on('new-chain', function (data) {
    if (mainBlockChain.length < data.length) {
      // $.ajax({
      //   url: 'wsdl',
      //   data: {
      //     data: ''
      //   },
      //   success: function (data) {
      //     console.log("data")

      //   }
      // })
      mainBlockChain = data;
      recomputeMap(mainBlockChain);
    }
  });
  socket.on('first-time', function (data) {
    mainBlockChain = data;
    recomputeMap(mainBlockChain);

  });

  function recomputeMap(chain) {
    layerNames.forEach(layer => {
      map.removeLayer(layer);
    });
    layerNames = [];
    chain.forEach(block => {
      if (block.index != 0)
        block.data.forEach(building => {

          moveOnMap = false;
          let imageName = 'image_' + imageId++;
          let loc = JSON.parse(building.buildingLocation);
          let color = new RGBColor(building.color);
          if (!map.hasImage(imageName)) {

            let w = building.buildingSize.split('x')[0] * 10;
            let h = building.buildingSize.split('x')[1] * 10;

            // let x = e.point.x;
            // let y = e.point.y;
            let width = w; // The image will be 64 pixels square
            let bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
            let data = new Uint8Array(w * h * bytesPerPixel);

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
                    "coordinates": [loc.lng, loc.lat]
                  }
                }]
              }
            },
            "layout": {
              "icon-image": imageName
            }
          });


        });

    });
  }

});