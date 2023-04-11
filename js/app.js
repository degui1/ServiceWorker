const APP = {
    SW: null,
    cacheName: 'assetCache1',
    init() {
      //called after DOMContentLoaded
    //   if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('/sw.js', {
    //         scope: '/',
    //       }).then(
    //         (registration) => {
    //         APP.SW =
    //           registration.installing ||
    //           registration.waiting ||
    //           registration.active;
    //       },
    //         (error) => {
    //             console.log('Service worker registration failed: ', error)
    //         }
    //       );
    //   } else {
    //     console.log('Service workers are not supported.');
    //   }
        APP.startCaching();
        // This is a event that delete cache when you click on h2 tag in the header
        document
            .querySelector('header>h2')
            .addEventListener('click', APP.deleteCache);
        
    },
    startCaching() {
        // open a cache in cache storage (you can see it in Application using your browser dev tools) and save some responses 
        caches.open(APP.cacheName).then(cache => {
            console.log(`Cache ${APP.cacheName} opened`);

            let urlString = '/img/image_1.jpg?id=none';
            cache.add(urlString); // add = fetch + put

            let URL = new URL('http://127.0.0.1:5500/img/image_1.jpg?id=none'); // This is a URL object
            cache.add(url);

            
        }); 
    },
    deleteCache() {

    }
  };
  
  document.addEventListener('DOMContentLoaded', APP.init);
  