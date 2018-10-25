const map = new google.maps.Map(document.getElementById('map'));
const mapService = new google.maps.places.PlacesService(map);

const init = () => {
    getSearchElements();
}

// append rating
const appendRating = (elm) => {
    let rating = document.createElement('div');
        rating.classList = 'rating wait';
        rating.innerHTML = '<span class="rating-stars"></span>';
    elm.appendChild(rating);
}

function updateRating(elm, results, status) {
    let innerHTML;

    if (status === 'OK' && results[0].rating !== 0) {
        let rate = results[0].rating;
        // get result
        innerHTML = rate + ' <span class="rating-stars"><span style="width: ' + computeStars(rate) + '"></span></span>';
    } else {
        // error
        innerHTML = '';
    }

    elm.querySelectorAll('.rating')[0].classList.remove('wait');
    elm.querySelectorAll('.rating')[0].innerHTML = innerHTML;
}

// browse search DOM
const getSearchElements = () => {
    let items = document.querySelectorAll('.dl-search-result');

    items.forEach( function(element, index) {
        let name = element.querySelectorAll('.dl-search-result-name')[0].textContent;
        let elmTarget = element.querySelectorAll('.dl-search-result-title')[0];
        console.log(name);
        appendRating(elmTarget, 'wait');
        getPlaceInfo(name, elmTarget);
    });
}

// request place data
const getPlaceInfo = (query, elm) => {
    let request = {
        query: query,
        // https://developers.google.com/places/web-service/details#fields
        fields: ['name', 'formatted_address', 'rating'],
    };

    mapService.findPlaceFromQuery(request, function(results, status) {
        console.log(query, status, results);
        updateRating(elm, results, status);
    });
}

// calculate stars element width
function computeStars(rate) {
  const baseSize = 69; // container's width (grey stars)

  // roundoff rate to nearest 0.5 for a half or plain star
  let rateRounded = Math.round(rate * 2) / 2;
  let starsWidth = Math.ceil(rateRounded * 69 / 5);

  return starsWidth + 'px';
}

init();
