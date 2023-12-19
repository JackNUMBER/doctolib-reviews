let script = document.createElement('script');
script.src = chrome.runtime.getURL('script.js');

// wait window.google
// LMK if you have any suggestion about how to improve that shit
setTimeout(() => {
    (document.body || document.head || document.documentElement).appendChild(script);
}, 300)

// append hidden map container
let mapElement = document.createElement('div');
    mapElement.id = 'map';
document.body.appendChild(mapElement);
