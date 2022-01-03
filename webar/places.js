const loadPlaces = function (coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    const method = 'places';

    const PLACES = [
        {
            name: "Rumah Saipul Muiz",
            location: {
                lat: -7.125251, // add here latitude if using static data
                lng: 108.218961, // add here longitude if using static data
            }
        },
        {
            name: "Rumah Batur",
            location: {
                lat: -7.125264, // add here latitude if using static data
                lng: 108.219046, // add here longitude if using static data
            }
        },
        {
            name: "Rumah Batur 2",
            location: {
                lat: -7.125320, // add here latitude if using static data
                lng: 108.219035, // add here longitude if using static data
            }
        },
    ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return Promise.resolve(PLACES);
};

// getting places from REST APIs
function loadPlaceFromAPIs(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ',
        clientSecret: '',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

// Places Name Version
window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('href', 'http://cektrend.com/');
                    text.setAttribute('scale', '.7 .7 .7');

                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(text);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};


// Clicked Version
// window.onload = () => {
//     const scene = document.querySelector('a-scene');

//     // first get current user location
//     return navigator.geolocation.getCurrentPosition(function (position) {

//         // than use it to load from remote APIs some places nearby
//         loadPlaces(position.coords)
//             .then((places) => {
//                 places.forEach((place) => {
//                     console.log(place)
//                     const latitude = place.location.lat;
//                     const longitude = place.location.lng;

//                     // add place icon
//                     const icon = document.createElement('a-image');
//                     icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
//                     icon.setAttribute('name', place.name);
//                     icon.setAttribute('src', './assets/icons/map-marker.png');

//                     // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
//                     icon.setAttribute('scale', '.7, .7');

//                     icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

//                     const clickListener = function (ev) {
//                         ev.stopPropagation();
//                         ev.preventDefault();
//                         alert('clicked');

//                         const name = ev.target.getAttribute('name');

//                         const el = ev.detail.intersection && ev.detail.intersection.object.el;

//                         if (el && el === ev.target) {
//                             const label = document.createElement('span');
//                             const container = document.createElement('div');
//                             container.setAttribute('id', 'place-label');
//                             label.innerText = name;
//                             container.appendChild(label);
//                             document.body.appendChild(container);

//                             setTimeout(() => {
//                                 container.parentElement.removeChild(container);
//                             }, 1500);
//                         }
//                     };

//                     icon.addEventListener('click', clickListener);

//                     scene.appendChild(icon);
//                 });
//             })
//     },
//         (err) => console.error('Error in retrieving position', err),
//         {
//             enableHighAccuracy: true,
//             maximumAge: 0,
//             timeout: 27000,
//         }
//     );
// };