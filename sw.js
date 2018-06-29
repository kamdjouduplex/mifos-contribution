
'use strict';
var CACHE_VERSION = 1;
var CURRENT_CACHES = 'currency-cache-'+ CACHE_VERSION;

const STATIC_FILES =[

	'index.html',
	'css/styles.min.css',
	'js/main.min.js',
	'assets/images/header.png'
];


self.addEventListener('install', event => {
	//perform install steps
	event.waitUntil(
		caches.open(CURRENT_CACHES)
		.then( cache => {
			console.log('Opened cache');
			return cache.addAll(STATIC_FILES);
		})
	)
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then( keys => {
			return Promise.all(keys.map( (key, i) => {
				if(key !== CURRENT_CACHES){
					return caches.delete(keys[i]);
				}
			}));
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
      	console.log(error);
      })
  );
});
