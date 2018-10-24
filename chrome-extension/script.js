const map = new google.maps.Map(document.getElementById('map'));
const mapService = new google.maps.places.PlacesService(map);

const init = () => {
    getSearchElements();
}

// append rating
const appendRating = (elm, status = null, rate = null) => {
    let classes = ['rating'];
    let innerHTML;

    if (status === 'wait') {
        // init
        classes.push('wait');
        innerHTML = '<span class="rating-stars"></span>'
    } else if (status === 'OK') {
        // get result
        innerHTML = '<span class="rating-stars"><span style="width: 0"></span></span>'
    } else {
        // error
        innerHTML = '';
    }

    let rating = document.createElement('div');
        rating.classList = classes.join(' ');
        rating.innerHTML = innerHTML;
    elm.appendChild(rating);
}

function updateRating(results, status) {
  console.log(status, results);
  // appendRating();
}

// browse search DOM
const getSearchElements = () => {
    let items = document.querySelectorAll('.dl-search-result');

    items.forEach( function(element, index) {
        let name = element.querySelectorAll('.dl-search-result-name')[0].textContent;
        console.log(name);
        appendRating(element.querySelectorAll('.dl-search-result-title')[0], 'wait');
        getPlaceInfo(name, element);
    });

    return items;
}

// request place data
const getPlaceInfo = (query, element) => {
  let request = {
    query: query,
    // https://developers.google.com/places/web-service/details#fields
    fields: ['name', 'formatted_address', 'rating', 'type'],
  };

  mapService.findPlaceFromQuery(request, updateRating);
}


init();
