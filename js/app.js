const APP = {
  SW: null,
  init() {
    //called after DOMContentLoaded
    //register our service worker
    APP.registerSW();
    document.querySelector('h2').addEventListener('click', e => {
      
    });
    document
    .getElementById('colorForm')
    .addEventListener('submit', APP.saveColor);
  },
  registerSW() {
    if ('serviceWorker' in navigator) {
      // Register a service worker hosted at the root of the site
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          APP.SW =
            registration.installing ||
            registration.waiting ||
            registration.active;
        },
        (error) => {
          console.log('Service worker registration failed:', error);
        }
      );
      // listen for the latest sw
      navigator.serviceWorker.addEventListener('controllerchange', async () => {
        APP.SW = navigator.serviceWorker.controller;
      });

      //listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', APP.onMessage);

    } else {
      console.log('Service workers are not supported.');
    }
  },
  saveColor(e) {
    e.preventDefault();
    let name = document.getElementById('name');
    let color = document.getElementById('color');
    let strName = name.value.trim();
    let strColor = color.value.trim();
    if (strName && strColor) {
      let person = {
        id: Date.now(),
        name: strName,
        color: strColor,
      };
      console.log('Save', person);
      // Send the data to the service worker
      APP.sendMessage({ AddPerson: person, otherAction: 'Hello'  });
    }
  },
  sendMessage(msg) {
    // Send some structured-cloneable data from webpage to the sw
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  },
  onMessage({ data }) { // the param is an event
    //got a message from the service worker
    console.log('Web page receiving', data);
  },
};
  
document.addEventListener('DOMContentLoaded', APP.init);