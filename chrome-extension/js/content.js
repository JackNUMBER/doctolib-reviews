let script = document.createElement('script');
script.src = chrome.extension.getURL('script.js');
setTimeout(function(){

(document.body || document.head || document.documentElement).appendChild(script);
}, 1000)

// append hidden map container
let mapElement = document.createElement('div');
    mapElement.id = 'map';
document.body.appendChild(mapElement);
