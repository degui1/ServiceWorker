const APP = {
    SW: null,
    init() {
        APP.registerSW();
        APP.getCacheSize();
        document.querySelector('header>h2').addEventListener('click', APP.addImage);
    },
    getCacheSize() {
        if ('storage' in navigator) {
            if ('estimate' in navigator.storage) {
                // get the total storage and current usage
                navigator.storage.estimate().then(({usage, quota, usageDetails}) => {
                    //returned numbers are in bytes
                    let usageKB = parseInt(usage / 1024);
                    let quotaKB   = parseInt(quota / 1024);             
                    console.log(`Using ${usageKB} KB of ${quotaKB} KB`);
                })
                // see if the storage can be set to persistent or stay best-effort
                navigator.storage.persist().then(isPer => {
                    console.log(`Browser grants persistent permission: ${isPer}`);
                })
            }
        } else console.warn('Storage Api is not supported');

        // look at individual files and their sizes
        caches.open('imageCache-5').then(cache => {
            cache.matchAll().then(matches => {
                let total = 0;
                matches.forEach(resp => {
                    if (resp.headers.has('content-length')) {
                        total += parseInt(resp.headers.get('content-length'));
                        console.log(`Adding size for ${resp.url}`);
                    }
                });
                console.log(`Total size in imageCache-1 is ${total}`);
            })
        })
    },
    registerSW() {
        if ('serviceWorker' in navigator) {

            navigator.serviceWorker.register('./sw.js').then(
                (reg => {
                    APP.SW = 
                        reg.installing ||
                        reg.waiting ||
                        reg.active;
                    
                }),
                (error => {
                    console.log('Service Worker registration failed', error);
                })
            )
        } else {
            console.log('Service workers are not supported');
        }
    },
    addImage(ev) {
        let img = document.createElement('img'); 
        img.src = '/img/x.jpg?id=one';
        img.alt = 'image';
        let p = document.createElement('p');
        p.append(img);
        document.querySelector('main').append(p);
    },
}

document.addEventListener('DOMContentLoaded', APP.init);