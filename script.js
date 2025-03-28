// LES VARIABLES : ---------------------------------------------------

const city = document.querySelector('#city');
const gps = document.querySelector('#gps');
const temperature = document.querySelector('#temperature');
const details1 = document.querySelector('#details1');
const details2 = document.querySelector('#details2');
const cityInput = document.querySelector('#cityInput');

// LES FONCTIONS : ---------------------------------------------------

async function fetchCoordinates (inputCity) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${inputCity}&format=json&addressdetails=1&limit=1`);
    const data = await response.json();
    city.innerText = "Ville non trouvée";
    gps.innerText = "-";
    details1.innerText = "Vérifiez le nom de la ville";
    details2.innerText = "";
    temperature.innerText = "";
    if (data[0]) {
        city.innerText = `${data[0].name} (${data[0].address.country})`;
        gps.innerText = `Coordonnées GPS : ${data[0].lat}, ${data[0].lon}`;
        fetchWeather(data[0].lat, data[0].lon);
    }
}

async function fetchWeather(lat, lon) {
    let x = Math.round(lat * 100) / 100;
    let y = Math.round(lon * 100) / 100;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&current=temperature_2m,precipitation,relative_humidity_2m`);
    const data = await response.json();
    temperature.innerText = `${data.current.temperature_2m}${data.current_units.temperature_2m}`;
    details1.innerText = `Précipitations : ${data.current.precipitation}${data.current_units.precipitation}`;
    details2.innerText = `Humidité relative : ${data.current.relative_humidity_2m}${data.current_units.relative_humidity_2m}`;
}

// LES EVENT LISTENERS : ---------------------------------------------

cityInput.addEventListener('change', async () => {
    fetchCoordinates(cityInput.value);
});

