const PAGE_SEARCH = 'search';
const PAGE_PROFILE = 'profile';
const API_BASE_URL = 'https://getdoctorrating-v5puavkc4q-uc.a.run.app/';

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
        const bodyNode = document.querySelector('body'); // or any other node
        const config = { childList: true, subtree: true };
        observer.observe(bodyNode, config);
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

    if (
        bodyClassList.contains('search_results-online_booking_search')
        && bodyClassList.contains('index')
    ) {
        // search page
        return PAGE_SEARCH;
    } else if (
        bodyClassList.contains('profiles')
        && bodyClassList.contains('show')
    ) {
        // profile page
        return PAGE_PROFILE;
    }
    console.log("PAGE_NOT_PROCESSABLE")
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

    const rating = results[0]?.rating
    const place_id = results[0]?.place_id
    if (status === 'OK' && rating && rating !== 0) {
        let rate = results[0].rating || "NF";
        // set results
        innerHTML = `
            <a href="https://www.google.com/maps/place/?q=place_id:${place_id}" target="_blank" rel="noreferrer noopener">
                ${rate} 
                <span class="rating-stars">
                    <span style="width: ${computeStars(rate)}"></span>
                </span>
            </a>`;
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
        const name = element.querySelector('[data-test="dl-search-result-name"]').textContent;

        const addressDiv = element.querySelector('.ml-96');

        const addressElements = addressDiv.querySelectorAll('.dl-text.dl-text-body.dl-text-regular.dl-text-s');

        const addresses = Array.from(addressElements).map(element => element.textContent)?.slice(0, 2);
        const address = addresses[0] || null;
        let elmTarget = element.querySelectorAll('.dl-search-result-title')[0];
        appendRating(elmTarget);
        getPlaceInfo(name, address, elmTarget);
    });
}

// browse page elements on search
const getProfileElement = () => {
    let elmTarget = document.querySelectorAll('.dl-profile-header-name-speciality')[0];
    let name = document.querySelectorAll('.dl-profile-header-name')[0].textContent;
    appendRating(elmTarget);
    // TODO - find address on profile page
    getPlaceInfo(name, null, elmTarget);
}

// request place data
const getPlaceInfo = (name, address, elm) => {
    // encode list of non null elements into a query string    
    let url = API_BASE_URL.concat(`?name=${name}`);
    if (address) {
      url = url.concat(`&address=${address}`);
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const status = data.status;
            const results = data.candidates;
            if (status === 'OK' && results.length) {
                updateRating(elm, results, status);
                return;
            }
            // console.log(name, address, status, results)
            return;
        })
        .catch(error => console.error('Error:', error));
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
