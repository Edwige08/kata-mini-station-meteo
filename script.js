// LES VARIABLES : ---------------------------------------------------

const city = document.querySelector('#city');
const gps = document.querySelector('#gps');
const temperature = document.querySelector('#temperature');
const details1 = document.querySelector('#details1');
const details2 = document.querySelector('#details2');
const cityInput = document.querySelector('#cityInput');
const ctx = document.getElementById('myChart');

// LES FONCTIONS : ---------------------------------------------------

async function fetchCoordinates(inputCity) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${inputCity}&format=json&addressdetails=1&limit=1`);
    const data = await response.json();
    city.innerText = "Ville non trouvée";
    gps.innerText = "-";
    details1.innerText = "Vérifiez le nom de la ville";
    details2.innerText = "";
    temperature.innerText = "";
    ctx.style.display = 'none'

    if (data[0]) {
        city.innerText = `${data[0].name} (${data[0].address.country})`;
        gps.innerText = `Coordonnées GPS : ${data[0].lat}, ${data[0].lon}`;
        fetchWeather(data[0].lat, data[0].lon);
        fetchPastWeather(data[0].lat, data[0].lon);
        ctx.style.display = 'flex';
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

// Fonction asynchrone pour afficher la T° heure par heure de la veille : 
async function fetchPastWeather(lat, lon) {
    let x = Math.round(lat * 100) / 100;
    let y = Math.round(lon * 100) / 100;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&hourly=temperature_2m,precipitation&past_days=2`);
    const data = await response.json();
    // let moy1DayAgo = 0;
    // let moy2DaysAgo = 0;
    // console.log(data.hourly.time[0])
    // console.log(data.hourly.temperature_2m[0])
    // console.log(data.hourly.time[23])
    // console.log(data.hourly.temperature_2m[23])

    let labelsTable = [];
    let dataTable = [];
    for (let index = 24; index < 48; index++) {
        labelsTable.push(`${data.hourly.time[index].substr(8, 2)}/${data.hourly.time[index].substr(5, 2)}/${data.hourly.time[index].substr(0, 4)}, ${data.hourly.time[index].substr(11, 2)}h`);
        dataTable.push(data.hourly.temperature_2m[index]);
    }

    if (myChart === true) {
        console.log('🍌')
        myChart.data.labels = labelsTable;
        myChart.data.datasets.data = dataTable
        // myChart.update();      
    } else {
        console.log('🍓')
        let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelsTable,
                datasets: [{
                    label: 'Température par heure',
                    data: dataTable,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    console.log(labelsTable);
    console.log(dataTable);

    // Problème : je n'arrive pas à recharger un autre graphique quand je change de ville.
}

// LES EVENT LISTENERS : ---------------------------------------------

cityInput.addEventListener('change', async () => {
    fetchCoordinates(cityInput.value);
});

