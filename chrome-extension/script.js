let map = new google.maps.Map(document.getElementById('map'));
let mapService = new google.maps.places.PlacesService(map);

const init = () => {
    console.log(getSearchElements());
}

const getSearchElements = () => {
    console.log();
    let items = document.querySelectorAll('.dl-search-result');

    items.forEach( function(element, index) {
        let name = element.children[0].children[0].children[1].children[0].textContent;
        console.log(name);
        getPlaceInfo(name)
    });

    return items;
}

function getPlaceInfo(query) {
  let request = {
    query: query,
    // https://developers.google.com/places/web-service/details#fields
    fields: ['name', 'formatted_address', 'rating', 'opening_hours'],
  };

  mapService.findPlaceFromQuery(request, callback);
}

function callback(results, status) {
  console.log(status, results);
}

init();


