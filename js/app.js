const APP = {
    SW: null,
    init() {
        APP.registerSW();
        document.querySelector('header>h2').addEventListener('click', APP.addImage);
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