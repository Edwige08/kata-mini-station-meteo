// LES VARIABLES : ---------------------------------------------------

const city = document.querySelector('#city');
const gps = document.querySelector('#gps');
const temperature = document.querySelector('#temperature');
const details = document.querySelector('#details');
const cityInput = document.querySelector('#cityInput');

// LES FONCTIONS : ---------------------------------------------------

async function fetchCoordinates (inputCity) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${inputCity}&format=json&addressdetails=1&limit=1`);
    const data = await response.json();
    city.innerText = "Ville non trouvée";
    gps.innerText = "-";
    details.innerText = "Vérifiez le nom de la ville";
    if (data[0]) {
        city.innerText = data[0].name;
        gps.innerText = `Coordonnées GPS : ${data[0].lat}, ${data[0].lon}`;
        fetchWeather(data[0].lat, data[0].lon);
    }
}

async function fetchWeather(lat, lon) {
    let x = Math.round(lat * 100) / 100;
    let y = Math.round(lon * 100) / 100;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&current=temperature_2m,precipitation,relative_humidity_2m`);
    const data = await response.json();
    temperature.innerText = `${data.current.temperature_2m}°C`;
    details.innerText = 'Température actuelle';
}

// LES EVENT LISTENERS : ---------------------------------------------

cityInput.addEventListener('change', async () => {
    fetchCoordinates(cityInput.value);
});

