window.addEventListener('online', function () {
    console.log('You are online!');
});
window.addEventListener('offline', function () {
    console.log('Oh no, you lost your network connection.');
});

document.addEventListener("DOMContentLoaded", () => {
    //    ServiceWorker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
            .then((registration) => {
                console.log('registration success, to scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('registeration fail: ', error);
            })
    } else {
        console.log('not available');
    }
});