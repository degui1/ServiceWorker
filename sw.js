const version = 9;
let staticName = `staticCache-${version}`;
let dynamicCache = 'dynamicCache';
let imgName = `imageCache-${version}`;
let options = {
  ignoreSearch: false,
  ignoreMethod: false,
  ignoreVary: false,
}

let assets = ['/', '/index.html', '/js/app.js', '/css/main.css', '404.html'];

let imgAssets = [
    '/img/j.jpg',
    '/img/x.jpg',
    '/img/notFound.jpg'
];


self.addEventListener('install', e => {
    //service worker has been installed
    //Extendable Event
    // self.skipWaiting(); // skip the wainting to activate
    //but the page will not use the new sw yet
    console.log(`Version ${version} installed`);

    e.waitUntil(
      caches.open(staticName).then(cache => {
        cache.addAll(assets).then(() => {

        },
        (err) => {
          console.warn(`failed to update ${staticName}`);
        }
        );
      }).then(() => {
        caches.open(imgName).then(cache => {
          cache.addAll(imgAssets).then(() => {

          },
          (err) => {
            console.warn(`failed to update ${imgAssets}`);
          }
          );
        })
      })
    )

});

self.addEventListener('activate', e => {
  console.log('activated');
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => {
          if (key != staticName && key != imgName) return true
        })
        .map(key => caches.delete(key))
      ).then(empty => {
        //empties is an Array of boolean value
        //one for each cache deleted
      });
    })
  )
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cacheRes => {
      return cacheRes || 
        Promise.resolve().then(() => {
          let opts = {
            mode: e.request.mode, // cors, no-cors, same-origin, navigate
            cache: 'no-cache',
          }
          if (!e.request.url.startsWith(location.origin)) {
            // not on the same domain as my html file
            opts.mode = 'cors';
            opts.credentials = 'omit';
          }
          return fetch(e.reques, opts).then(fetchResponse => {
            //we got a response from the server
            if (fetchResponse.ok) {
              return handleFetchResponse(fetchResponse, e.request);
            }
            // 404 error
            if (fetchResponse.status == 404) {
              if (e.request.url.match(/\.html/i)) {
                return caches.open(staticName).then(cache => {
                  return cache.match('/404.html');
                })
              }
              if (e.request.url.match(/\.jpg$/i) || e.request.url.match(/\.png$/i)) {
                return caches.open(imgName).then(cache => {
                  return cache.match('/notFound.jpg');
                })
              }
            }
          },
          (err) => {
            if (e.request.url.match(/\.html/i)) {
              return caches.open(staticName).then(cache => {
                return cache.match('/404.html');
              })
            }
          }
          );
        });
    })
  );
})

const handleFetchResponse = (fetchResponse, request) => {
  let type = fetchResponse.headers.get('content-type');

  if (type && type.match(/^image\//i)) {
        //save the image in image cache
    // console.log(`SAVE ${request.url} in image cache`);
    return caches.open(imgName).then(cache => {
      cache.put(request, fetchResponse.clone());
      return fetchResponse;
    });
  } else {
        //save the image in image cache
    // console.log(`SAVE ${request.url} in image cache`);
    return caches.open(dynamicCache).then(cache => {
      cache.put(request, fetchResponse.clone());
      return fetchResponse;
    });
  }
};

self.addEventListener('message', e => {
    //messa from webpage
    let data = e.data;
    let clientId = e.source.id;

    if ('AddPerson' in data) {
      let msg = 'Hello, service worker here!';
      sendMessage({
        code: 0,
        message: msg,
      }, clientId);
    }
    // if ('otherAction' in data) {
    //   let msg = 'Hello, other action here';
    //   sendMessage({
    //    code: 0,
    //    message: msg, 
    //   })
    // }
});

const sendMessage = async (msg, clientId) => {
  let allClients = [];

  if (clientId) {
    let client = await clients.get(clientId);
    allClients.push(client);
  } else {
    allClients = await clients.matchAll({ includeUncontrolled: true });
  }

  return Promise.all(
    allClients.map(client => {
      return client.postMessage(msg);
    })
  );
};