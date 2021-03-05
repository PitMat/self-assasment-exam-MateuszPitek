const imgUrl = './de.farefinder.json';

(async function() {
    try {
        const datas = await getDataFly("KRK", 30, "pl", "2021-03-10", "2022-03-02", 300);
        const destination = selectCountryByCode(datas.fares);
        displayResults(destination)

    } catch (err) {
        console.error(err.message)
    }
})()

async function getDataFly(iataCode, limit, market, dateFrom, dateTo, price) {
    const response = await fetch(`https://www.ryanair.com/api/farfnd/3/oneWayFares?&departureAirportIataCode=${iataCode}&language=pl&limit=${limit}&market=${market}-pl&offset=0&outboundDepartureDateFrom=${dateFrom}&outboundDepartureDateTo=${dateTo}&priceValueTo=${price}`);
    if (response.ok) {
        return response.json();
    }
    throw Error(`error from server: ${response.statusText}`);
}

function selectCountryByCode(data) {
    const countryByCode = data.filter(destination => {
        return destination.outbound.arrivalAirport.city.countryCode.match(/es|se|de|fr/gi)
    })
    return countryByCode.map(destination => {
        return {
            countryName: destination.outbound.arrivalAirport.countryName,
            cityName: destination.outbound.arrivalAirport.city.name,
            arrivalDate: destination.outbound.arrivalDate,
            price: destination.outbound.price.value,
            currencySymbol: destination.outbound.price.currencySymbol,
            iataCode: destination.outbound.arrivalAirport.iataCode,
        }
    })
}


async function getImages(imgUrl) {
    const response = await fetch(imgUrl);
    if (response.ok) {
        return response.json();
    }
    throw Error(`Error: ${response.statusText}`);
}

async function displayResults(data) {
    const flyImages = await getImages(imgUrl);
    data.forEach(destination => {
        const div = document.createElement('div');
        let imgUrl = flyImages.destinationInformation[`${destination.iataCode}`] ? flyImages.destinationInformation[`${destination.iataCode}`].imageRegularUrl : "";
        imgUrl = `https://www.ryanair.com/${imgUrl}`;
        div.innerHTML = `<img src="${imgUrl}">${destination.countryName}, ${destination.cityName}, ${destination.arrivalDate}, ${destination.price}${destination.currencySymbol}`;
        document.body.appendChild(div);
    })
}