// API link

(async function () {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    await d3.json(url, function(parsedJSON){
        console.log(parsedJSON.features)
        createMap(parsedJSON.features)
    });
})()

// legend color collection

function chooseColor(magnitude) {
    return magnitude > 5 ? '#FF0000':
           magnitude > 4 ? '#ffd700':
           magnitude > 3 ? '#FFFF00':
           magnitude > 2 ? '#9ACD32':
           magnitude > 1 ? '#ADFF2F':
                           '#c5eddf';
                    
                }
// Create a layer control

function createMap(response) {

    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 19,
            id: "mapbox.streets",
            accessToken: API_KEY
    });

// Define the layers of the map the dark map

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 19,
            id: "mapbox.dark",
            accessToken: API_KEY
    });
 
    // explain map objects with the main layers
  
const baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
};

//  give the map satelitemap and earthquakes layers to display on load

    const myMap = L.map("map", {
        center: [31.57853542647338,-99.580078125],
        zoom: 3,
        layers: streetmap
    });

    response.forEach(data => {        
        if (data.geometry) {
            let coord = [data.geometry.coordinates[1], data.geometry.coordinates[0]]
            return L.circle(coord, {

                radius: data.properties.mag * 30000,
                color: "white",
                fillColor: chooseColor(data.properties.mag),
                fillOpacity: 1,
                weight: 0.6

            }).bindPopup("<h1>" + data.properties.title + "</h1> <hr> <h3>Magnitude: " + data.properties.mag + "</h3>").addTo(myMap);
        }
    })

    response.forEach(data => {        
        if (data.geometry) {
            let coord = [data.geometry.coordinates[1], data.geometry.coordinates[0]]
            return L.circle(coord, {
    
                radius: data.properties.mag * 30000,
                color: "green",
                fillColor: chooseColor(data.properties.mag),
                fillOpacity: 1,
                weight: 0.5
    
            }).bindPopup("<h1>" + data.properties.title + "</h1> <hr> <h3>Magnitude: " + data.properties.mag + "</h3>").addTo(myMap);
        }
    });
    

// Add a layers to control the map
    
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        mags = ["0-1","1-2","2-3","3-4","4-5",">5"]
        colors = [0.5,1.5,2.5,3.5,4.5,5.5]
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(colors[i]) + '"></i> ' +
                (mags[i] ? mags[i] + '<br>' : '+');
        }
        return div;
    };

    L.control.layers(baseMaps).addTo(myMap);
    legend.addTo(myMap);
}



