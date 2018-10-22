 // inject Google Maps API file
 const head = document.getElementsByTagName('head')[0];
 const script = document.createElement('script');
 script.type = 'text/javascript';
 script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyChcp4x8Khn1P32qeoXBipluszPDdHALIU&libraries=places';
 // head.appendChild(script);


const init = () => {
    console.log(getSearchElements());
}

const getSearchElements = () => {
    console.log();
    let items = document.querySelectorAll('.dl-search-result');

    items.forEach( function(element, index) {
        let name = element.children[0].children[0].children[1].children[0].textContent;
        console.log(name);
        // getPlaceInfo(name)
    });

    return items;
}

init();

