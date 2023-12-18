const PAGE_SEARCH = 'search';
const PAGE_PROFILE = 'profile';

// Select the node that will be observed for mutations
const targetNode = document.querySelector('body'); // or any other node

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const searchPageCallback = function(mutationsList, observer) {
    // Look through all mutations that just occured
    for(let mutation of mutationsList) {
        // If the addedNodes property has one or more nodes
        if(mutation.addedNodes.length) {
            let items = document.querySelectorAll('.dl-search-result');
            if(items.length) {
                observer.disconnect();
                getSearchElements();
                break;
            }
        }
    }
};

const init = () => {
    switch (getCurrentPage()) {
      case PAGE_SEARCH:
        const observer = new MutationObserver(searchPageCallback);
        observer.observe(targetNode, config);
        break;
      case PAGE_PROFILE:
        getProfileElement();
        break;
      default:
        return;
    }
}

const getCurrentPage = elm => {
    const bodyClassList = document.body.classList;
    console.log("Getting current page")
    console.log({bodyClassList})

    if (
        bodyClassList.contains('search_results-online_booking_search')
        && bodyClassList.contains('index')
    ) {
        // search page
        console.log("PAGE_SEARCH")
        return PAGE_SEARCH;
    } else if (
        bodyClassList.contains('profiles')
        && bodyClassList.contains('show')
    ) {
        // profile page
        return PAGE_PROFILE;
        console.log("PAGE_PROFILE")
    }
    console.log("PAGE_NONE")
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

document.addEventListener('DOMContentLoaded', (event) => {
    const element = document.querySelector('.js-dl-doctor-results');
    const data = JSON.parse(element.dataset.props);

    // Assuming each result in data.searchResults has a 'rating' property
    data.searchResults.forEach(result => {
        // Create a new div for the rating
        const ratingDiv = document.createElement('div');
        ratingDiv.textContent = `Rating: ${result.rating}`;

        // Append the rating div to the element
        element.appendChild(ratingDiv);
    });
});

// browse page elements on search
const getSearchElements = () => {
    let items = document.querySelectorAll('.dl-search-result');

    items.forEach((element, index) => {
        let name = element.querySelector('[data-test="dl-search-result-name"]').textContent;
        console.log(name);
        let elmTarget = element.querySelectorAll('.dl-search-result-title')[0];
        appendRating(elmTarget);
        // getPlaceInfo(name, elmTarget);
    });
}

// browse page elements on search
const getProfileElement = () => {
    let elmTarget = document.querySelectorAll('.dl-profile-header-name-speciality')[0];
    let name = document.querySelectorAll('.dl-profile-header-name')[0].textContent;
    appendRating(elmTarget);
    getPlaceInfo(name, elmTarget);
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
