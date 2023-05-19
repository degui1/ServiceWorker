const version = 5;
let staticName = `staticCache-${version}`;
let dynamicCache = 'dynamicCache';
let fontName = `fontCache-${version}`;
let imgName = `imageCache-${version}`;

let assets = ['/','/index.html','/js/app.js'];

let imgAssets = [
    '/img/j.jpg',
    '/img/x.jpg',
    '/img/j.jpg?id=one',
    '/img/x.jpg?id=one',
    '/img/j.jpg?id=two',
    '/img/x.jpg?id=two',
    '/img/j.jpg?id=three',
    '/img/x.jpg?id=three',
];


self.addEventListener('install', e => {
    //service worker has been installed
    //Extendable Event
    // self.skipWaiting(); // skip the wainting to activate
    //but the page will not use the new sw yet
    caches.open(staticName).then(cache => {
        cache.addAll(assets).then(()=> {
            console.log(`${staticName} has been updated`);
        },
        (error => {
            console.warn(`failed to update ${staticName}`);
        })
        );
    })
    .then(() => {
        caches.open(imgName).then(cache => {
            cache.addAll(imgAssets).then(() => {
                console.log(`${imgName} has been updated`);
            },
            (error => {
                console.warn(`failed to update ${imgName}`);
            })
            );
        });
    })

});

self.addEventListener('activate', e => {
    //when the service worker has been activated to replace an old one
    //extendable event
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => {
                    if (key != staticName && key != imgName) return true;
                })
                .map(key => caches.delete(key))
            ).then(empty => {

            });
        })
    )
});

self.addEventListener('fetch', e => {
    console.log('intercepted a http request', e.request);
});

self.addEventListener('message', e => {
 //messa from webpage
});