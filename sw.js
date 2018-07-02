
'use strict';
const CACHE_VERSION = 1;
const CURRENT_CACHES = 'currency-cache-'+ CACHE_VERSION;

const STATIC_FILES =[
	'/',
	'/index.html',
	'/css/styles.min.css',
	'/js/main.min.js',
	'/assets/images/header.png',
	'/favicon.ico'
];


self.addEventListener('install', event => {
	//perform install steps
	event.waitUntil(
		caches.open(CURRENT_CACHES)
		.then( cache => {
			return cache.addAll(STATIC_FILES);
		})
		.then( () => {
			console.log('WORKER: install completed');
		})
	)
});



self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then( response => {
        // Cache hit - return response
        if (response) {
          	return response;
        }
        return fetch(event.request);
      })
      .catch( (error) => {
      	console.log('No internet Connection. You must carry this operation atleast once when connected before it works offline');
      })
  );
});


self.addEventListener('activate', event => {
	console.log('WORKER: activate event in progress.');
	event.waitUntil(
	    caches
	      .keys()
	      .then( (keys) => {
	        return Promise.all(
	          keys
	            .filter( (key) => {
	              return !key.startsWith(CURRENT_CACHES);
	            })
	            .map( (key) => {
	              return caches.delete(key);
	            })
	        );
	      })
	      .then( () => {
	        console.log('WORKER: activate completed.');
	      })
	 );
});
