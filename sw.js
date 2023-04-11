// There's a variable called 'self' that represents serviceWorker itself
// Take a look:
// console.log({ self });

// Self has access to most of the things that would in the window object
// You do not have access to the DOM
// Self can access the server
// send fetch calls from service worker to get files (because you can not access the DOM)
// and can storage files in the cache storage almost as a proxy server

//some events that you have in the service worker

self.addEventListener('install', (event) => {
// When service worker is installed
    console.log('Installed');
});

self.addEventListener('activate', (event) => {
// when service worker is activated
    console.log('Activated');
});

self.addEventListener('fetch', (event) => {
//used to intercept a fetch call
// css file and app file are examples of fetch's that it will intercept
    console.log('intercepted a http request', event.request);
});

self.addEventListener('message', (event) => {
// message form webpage

});
