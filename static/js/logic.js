// API endpoint inside url
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(earthquakeURL, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // def func to run for each feature in feature array
    // give pop up for magnitude, place and time
    // create json layer
    // run onEachFeature
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: " + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },

        pointToLayer: function(feature, latling) {
            return new L.circle(latlng,
            {radius: getRadius(feature.properties.mag),
             fillColor: getColor(feauture.properties.mag),
             fillOpacity: .6,
             color: "#000",
             stroke: true,
             weight: .8
            })
        }
    });

    createMap(earthquakes);
}


function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw." +
      "T6YbdDixkOBWH_k9GbS8JQ");
  
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw." +
      "T6YbdDixkOBWH_k9GbS8JQ");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw." +
      "T6YbdDixkOBWH_k9GbS8JQ");

    var baseMaps = {
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Dark Map": darkmap
    };

    var tectonicPlates = new L.LayerGroup();

    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3.25,
        layers: [outdoors, earthquakes, tectonicPlates]
    });

    d3.json(tectonicPlatesURL, function(plateData) {
        L.geoJSON(plateData, {
            color: "yellow",
            weight: 2
        })
        .addTo(tectonicPlates);
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function(myMap){
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 1, 2, 3, 4, 5],
                labels = [];

        for (var i=0; i<grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' : '+');
        }
        return div; 
        };

        legend.addTo(myMap);
}

function getColor(d) {
    return d>5 ? "#a54500":
    d>4 ? "#cc5500":
    d>3 ? "#ff6f08":
    d>2 ? "#ff9143":
    d>1 ? "#ffb37e":
            "#ffca5";
}

function getRadius(value) {
    return value*25000
}