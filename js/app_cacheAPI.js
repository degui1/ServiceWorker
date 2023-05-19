const APP = {
    SW: null,
    cacheName: 'assetsCache1',
    init(){
   
        if ('serviceWorker' in navigator) {
            
            navigator.serviceWorker.register('./sw.js', {
                scope: '/',
            }).then(response => {
                APP.SW = 
                    response.installing ||
                    response.waiting ||
                    response.active;
            },
            (error => {
                console.log('Service Worker registration failed', error);
            }) 
            );

            // if (navigator.serviceWorker.controller) {
            //     console.log('We have a service worker installed');
            // }

            // navigator.serviceWorker.oncontrollerchange = (e) => {
            //     console.log("Service has changed", e);
            // }
        } else {
            console.log('Service workers are not supported');
        }




    APP.startCaching();
        document.querySelector('header>h2')
        .addEventListener('click', APP.deleteCache);
    },
    startCaching() {
        return caches.open(APP.cacheName).then( cache => {
            let urlString = '/img/x.jpg?id=one'
            cache.add(urlString); //add = fetch + put

            let url = new URL('http://127.0.0.1:5500/img/x.jpg?id=two');
            cache.add(url);

            let req = new Request('/img/x.jpg?id=three');
            cache.add(req);         

            cache.keys().then( keys => {
                keys.forEach((key, index) => {
                    console.log(index, key);
                })
            });

            return cache;
        }).then(cache => {
            caches.has(APP.cacheName).then(hasCache => {
                console.log(`${APP.cacheName} ${hasCache}`);
            });

            let urlString = '/img/j.jpg?id=three'

            return cache.match(urlString).then(cacheResponse => {
                if (cacheResponse &&
                    cacheResponse.status < 400 &&
                    cacheResponse.headers.has('content-type') &&
                    cacheResponse.headers.get('content-type').match(/^image\//i)
                    ) {
                        console.log('Found in the cache');
                        return cacheResponse;
                } 
                else {
                    console.log('not in cache')
                    return fetch(urlString).then(fetchResponse => {
                        cache.put(urlString, fetchResponse.clone());
                        return fetchResponse;
                    });
                }
            })
        }).then(resp => {
            console.log(resp);
            document.querySelector('output').textContent = resp.url;
            return resp.blob();
        }).then(blob => {
            let url = URL.createObjectURL(blob);
            let image = document.createElement('img');
            image.src = url;
            document.querySelector('output').append(image);
        });
    },
    deleteCache() {
        caches.open(APP.cacheName).then(cache => {
            let url = '/img/x.jpg?id=one';
            cache.delete(url).then(isGone => {
                console.log(`${url} ${isGone}`);
            });
        });

    },
    deleteAllCache() {
        caches.delete(APP.cacheName).then(isGone => {
            console.log(`${APP.cacheName} removed: ${isGone}`);
        });
    }

}

document.addEventListener('DOMContentLoaded', APP.init);