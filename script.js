// LES VARIABLES : ---------------------------------------------------

const city = document.querySelector('#city');
const gps = document.querySelector('#gps');
const temperature = document.querySelector('#temperature');
const details = document.querySelector('#details');
const cityInput = document.querySelector('#cityInput');

// LES FONCTIONS : ---------------------------------------------------

async function fetchCoordinates (inputCity) {
    city.innerText = "";
    gps.innerText = "";
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${inputCity}&format=json&addressdetails=1&limit=1`);
    const data = await response.json();
    console.log(data[0])
    console.log("lat = " + data[0].lat);
    console.log("lon = " + data[0].lon);
    console.log (data[0].address.city);
    if (data[0]) {
        city.innerText = data[0].address.city;
        gps.innerText = `Coordonnées GPS : ${data[0].lat}, ${data[0].lon}`;
        fetchWeather(data[0].lat, data[0].lon);
    } else {
        city.innerText = "Ville non trouvée";   // Ne marche pas :'(
        gps.innerText = '-';                    // Ne marche pas :'(

    }
}

async function fetchWeather(lat, lon) {
    let x = Math.round(lat * 100) / 100
    let y = Math.round(lon * 100) / 100
    console.log(`x = ${x} et y = ${y}`)
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&current=temperature_2m,precipitation,relative_humidity_2m`);
    const data = await response.json();
    console.log("🍓" + data.current.temperature_2m)
    temperature.innerText = `${data.current.temperature_2m}°C`;
    details.innerText = 'Température actuelle';
}
// LES EVENT LISTENERS : ---------------------------------------------
cityInput.addEventListener('change', async () => {
    console.log(cityInput.value)
    fetchCoordinates(cityInput.value)
    // fetchWeather()
});

