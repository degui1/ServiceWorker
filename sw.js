const version = 2;
let staticName = `staticCache-${version}`;
let dynamicCache = 'dynamicCache';
let imgName = `imageCache-${version}`;

let assets = ['/', '/index.html', '/js/app.js', '/css/main.css', '404.html'];

let imgAssets = [
    '/img/j.jpg',
    '/img/x.jpg',
    '/img/j.jpg?id=one',
    '/img/x.jpg?id=one',
    '/img/j.jpg?id=two',
    '/img/x.jpg?id=two',
    '/img/j.jpg?id=three',
    '/img/x.jpg?id=three',
    '/img/notFound.jpg'
];


self.addEventListener('install', e => {
    //service worker has been installed
    //Extendable Event
    // self.skipWaiting(); // skip the wainting to activate
    //but the page will not use the new sw yet
    caches.open(staticName).then(cache => {
        cache.addAll(assets).then(() => {
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

self.addEventListener('fetch', (e) => {
    // Extendable Event.
    console.log(`MODE: ${e.request.mode} for ${e.request.url}`);
  
    e.respondWith(
      caches.match(e.request).then((cacheRes) => {
        return (
          cacheRes ||
          Promise.resolve().then(() => {
            let opts = {
              mode: e.request.mode, //cors, no-cors, same-origin, navigate
              cache: 'no-cache',
            };
            if (!e.request.url.startsWith(location.origin)) {
              //not on the same domain as my html file
              opts.mode = 'cors';
              opts.credentials = 'omit';
            }
            return fetch(e.request.url, opts).then(
              (fetchResponse) => {
                //we got a response from the server.
                if (fetchResponse.ok) {
                  return handleFetchResponse(fetchResponse, e.request);
                }
                //not ok 404 error
                if (fetchResponse.status == 404) {
                  if (e.request.url.match(/\.html/i)) {
                    return caches.open(staticName).then((cache) => {
                      return cache.match('/404.html');
                    });
                  }
                  if (
                    e.request.url.match(/\.jpg$/i) ||
                    e.request.url.match(/\.png$/i)
                  ) {
                    return caches.open(imageName).then((cache) => {
                      return cache.match('/img/distracted-boyfriend.jpg');
                    });
                  }
                }
              },
              (err) => {
                //this is the network failure
                //return the 404.html file if it is a request for an html file
                if (e.request.url.match(/\.html/i)) {
                  return caches.open(staticName).then((cache) => {
                    return cache.match('/404.html');
                  });
                }
              }
            );
            //.catch()
          })
        );
      }) //end of match().then()
    ); //end of respondWith
  }); //end of fetch listener
  
  const handleFetchResponse = (fetchResponse, request) => {
    let type = fetchResponse.headers.get('content-type');
    // console.log('handle request for', type, request.url);
    if (type && type.match(/^image\//i)) {
      //save the image in image cache
      console.log(`SAVE ${request.url} in image cache`);
      return caches.open(imageName).then((cache) => {
        cache.put(request, fetchResponse.clone());
        return fetchResponse;
      });
    } else {
      //save in dynamic cache - html, css, fonts, js, etc
      console.log(`SAVE ${request.url} in dynamic cache`);
      return caches.open(dynamicName).then((cache) => {
        cache.put(request, fetchResponse.clone());
        return fetchResponse;
      });
    }
  };

self.addEventListener('message', e => {
    //messa from webpage
});