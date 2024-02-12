export async function createMap(){
    const provinceWeather = JSON.parse(localStorage.getItem("currentWeather"))
const map = L.map('map').setView([36, 36], 5);

	const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
    /* 
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    */
	const info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
        const provinceInfo = props ? provinceWeather.filter((pw)=>pw.cityName == props.name):""
		const contents = provinceInfo ? `<div class="d-flex align-items-center flex-column text-center">
        <div>
          <h2>${props.name}</h2>
        </div>
        <div class="text-center">
          <div><h1>${Math.floor(provinceInfo[0].main.temp)} °C</h1></div>
          <div><h3>${provinceInfo[0].weather[0].description.toUpperCase()}</h3></div>
        </div>
        <br />
        <div><h5 style="color:#4f29f0">Click on the city for the 4-day weather forecast of this city</h5></div>
      </div>` : 'Hover over the city';
        this._div.innerHTML = `<div class="row">
        <div class="col-12">
            <div class="card border-light shadow-soft">
                <div class="card-body">
                    ${contents} 
                </div>
            </div>
        </div>
    </div>`
	};

	info.addTo(map);


	// get color depending on population density value
    function getColor(t) {
        return t >= 30 ? '#bb3d02' :
               t >= 25 ? '#e45709' :
               t >= 20  ? '#f67824' :
               t >= 15  ? '#fdae6a' :
               t >= 10  ? '#fdd1a3' :
               t >= 5  ? '#fee1c4' :
               t >= 0  ? '#fff5ea' :
               t >= -5  ? '#eef5fc' :
               t >= -10   ? '#ddeaf7' :
               t >= -15   ? '#cadef0' :
               t >= -20   ? '#97c6df' :
                          '#4997c9';
    }
	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: '#aaa',
			dashArray: '3',
			fillOpacity: 0.5,
			fillColor: getColor(feature.properties.temp)
		};
	}
	function highlightFeature(e) {
		const layer = e.target;

		layer.setStyle({
			weight: 1,
			color: '#000',
			dashArray: '',
			fillOpacity: 0.5
		});

		layer.bringToFront();

		info.update(layer.feature.properties);
	}
    for(let i=0;i<statesData.features.length;i++)
    {
        statesData.features[i].properties.temp = provinceWeather[i].main.temp;
    }
	/* global statesData */
	const geojson = L.geoJson(statesData, {
		style,
		onEachFeature,
	}).addTo(map);
	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
        window.open(`/cities/city.html?city=${e.target.feature.properties.name}`)
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend shadow-soft'),
        grades = [30,25,20,15,10,5,0,-5,-10,-15,-20]
    div.innerHTML += '<div><i style="background:' + getColor(grades[0] - 1) + '"></i>' + `<span class="d-block text-center">${grades[0]}↑</span>` + "</div>"
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<div><i style="background:' + getColor(grades[i] + 1) + '"></i> ' + `<span class="d-block text-center">${grades[i]  + (grades[i + 1] || grades[i + 1] == 0 ? ' / ' + grades[i + 1] : "↓")}</span></div>`;
    }

    return div;
};

legend.addTo(map);

}