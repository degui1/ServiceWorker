self.addEventListener('install', e => {
    //service worker has been installed
    //Extendable Event
    e.waitUntil(
        Promise.resolve()
        .then(()=> {
            manuel();
        })
        .then(()=> {
            //the prommise returned from teja will wait until resolves
            // before going to the next then()
            return teja();
        })
        .then(()=> {
            // when this then() returns undefined
            // it goes to the ev.waitUntil
            // which will change our state from installing to installed
            console.log("installed");
        })
    );

    // self.skipWaiting(); // skip the wainting to activate
    //but the page will not use the new sw yet
});

function teja() {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve();
            console.log('teja');
        }, 2000)
    });
}

function manuel() {
    console.log('manuel');
}

self.addEventListener('activate', e => {
    //when the service worker has been activated to replace an old one
    //extendable event
    console.log("Activated - this worker not used until page reloads");
    // clients.claim().then(() => {
    //     //claim mens that the html file will use this new service worker.
    //     console.log(
    //         "the service worker has now claimed all pages so they use the new service worker"
    //     );
    // });
});

self.addEventListener('fetch', e => {
    console.log('intercepted a http request', e.request);
});

self.addEventListener('message', e => {
 //messa from webpage
});