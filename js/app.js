const APP = {
    sw: null,
    init() {
        if ('serviceWorker' in navigator) {
            // Delay registration until after the page has loaded, to ensure that our
            // precaching requests don't degrade the first visit experience.
            // window.addEventListener('load', function() {
                // Your service-worker.js *must* be located at the top-level directory relative to your site.
                // It won't be able to control pages unless it's located at the same level or higher than them.
                // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
                navigator.serviceWorker.register('sw.js').then(function(registration) {
                // updatefound is fired if service-worker.js changes.
                    registration.onupdatefound = function() {
                        // The updatefound event implies that reg.installing is set
                        var installingWorker = registration.installing;
                
                        installingWorker.onstatechange = function() {
                            switch (installingWorker.state) {
                                case 'installed':
                                    if (navigator.serviceWorker.controller) {
                                        // At this point, the old content will have been purged and the fresh content will
                                        // have been added to the cache.
                                        // It's the perfect time to display a "New content is available; please refresh."
                                        // message in the page's interface.
                                        console.log('New or updated content is available.');
                                    } else {
                                        // At this point, everything has been precached.
                                        // It's the perfect time to display a "Content is cached for offline use." message.
                                        console.log('Content is now available offline!');
                                    }
                                    break;
                    
                                case 'redundant':
                                    console.error('The installing service worker became redundant.');
                                    break;
                        }
                        };
                    };
                }).catch(function(e) {
                console.error('Error during service worker registration:', e);
                });
            // });
        }
    },
};

document.addEventListener('DOMContentLoaded', APP.init);