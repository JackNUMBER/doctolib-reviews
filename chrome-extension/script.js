const map = new google.maps.Map(document.getElementById('map'));
const mapService = new google.maps.places.PlacesService(map);

const init = () => {
    getSearchElements();
}

// append rating
const appendRating = (elm) => {
    let rating = document.createElement('div');
        rating.classList = 'rating';
        rating.textContent = 'rating';
        rating.insertAdjacentHTML( 'beforeend', '<span id="rating-stars"><span style="width: 10px"></span></span>');
    elm.appendChild(rating);
}

// browse search DOM
const getSearchElements = () => {
    let items = document.querySelectorAll('.dl-search-result');

    items.forEach( function(element, index) {
        let name = element.querySelectorAll('.dl-search-result-name')[0].textContent;
        console.log(name);
        getPlaceInfo(name);
        appendRating(element.querySelectorAll('.dl-search-result-title')[0]); // .dl-search-result-title
    });

    return items;
}

// request place data
const getPlaceInfo = (query) => {
  let request = {
    query: query,
    // https://developers.google.com/places/web-service/details#fields
    fields: ['name', 'formatted_address', 'rating', 'opening_hours'],
  };

  // mapService.findPlaceFromQuery(request, callback);
}

function callback(results, status) {
  console.log(status, results);
}

init();
