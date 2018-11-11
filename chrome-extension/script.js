const PAGE_SEARCH = 'search';

const init = () => {
    switch (getCurrentPage()) {
      case PAGE_SEARCH:
        getSearchElements();
        break;
      default:
        return;
    }
}

const getCurrentPage = elm => {
    const bodyClassList = document.body.classList;

    if (
        bodyClassList.contains('profiles')
        && bodyClassList.contains('index')
    ) {
        // search page
        return PAGE_SEARCH;
    }

}

// append rating
const appendRating = elm => {
    let rating = document.createElement('div');
        rating.classList = 'rating wait';
        rating.innerHTML = '<span class="rating-stars"></span>';
    elm.appendChild(rating);
}

const updateRating = (elm, results, status) => {
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

// browse page elements on search
const getSearchElements = () => {
    let items = document.querySelectorAll('.dl-search-result');

    items.forEach((element, index) => {
        let name = element.querySelectorAll('.dl-search-result-name')[0].textContent;
        let elmTarget = element.querySelectorAll('.dl-search-result-title')[0];
        appendRating(elmTarget, 'wait');
        getPlaceInfo(name, elmTarget);
    });
}

// browse page elements on search
const getProfileElement = () => {
    let item = document.querySelectorAll('.dl-profile-header-name-speciality');
    console.log('getProfileElement', item);
}

// request place data
const getPlaceInfo = (query, elm) => {
    const request = {
        query: query,
        // https://developers.google.com/places/web-service/details#fields
        fields: ['id', 'name', 'formatted_address', 'rating'],
    };

    const map = new google.maps.Map(document.getElementById('map'));
    const mapService = new google.maps.places.PlacesService(map);

    mapService.findPlaceFromQuery(request, (results, status) => {
        // console.log(query, status, results);
        updateRating(elm, results, status);
    });
}

// calculate stars element width
const computeStars = rate => {
  const baseSize = 69; // container's width (grey stars)

  // roundoff rate to nearest 0.5 for a half or plain star
  let rateRounded = Math.round(rate * 2) / 2;
  let starsWidth = Math.ceil(rateRounded * baseSize / 5);

  return starsWidth + 'px';
}

init();
