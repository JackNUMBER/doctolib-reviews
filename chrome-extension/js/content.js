let script = document.createElement('script');
script.src = chrome.extension.getURL('script.js');
(document.body || document.head || document.documentElement).appendChild(script);

// append hidden map container
let mapElement = document.createElement('div');
    mapElement.id = 'map';
document.body.appendChild(mapElement);
