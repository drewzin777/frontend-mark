 //initialize map
let map; 
let service;  
let infowindow; 

function initMap() {
    //get place_Id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const place_Id = urlParams.get('place_id');

    if (place_Id) {
        console.log('initialzeDetailsPage');
        //if a place_id exists were on details page 
        initializeDetailsPage(place_Id);
    } else {
        //if no place_id were on the index(main)page
        initializeMainPage();
    }
}
console.log(initMap);
   
    //main page (index.html): search for nearby restaurants
    function initializeMainPage() {
        const defaultLocation = { lat: 40.730610, lng: -73.935242 }; //default location
    
    //initializze map
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 15,
    });

    //event listener for the "find restaurants" button
    document.getElementById('findRestaurants').addEventListener('click', () => {
        const locationInput = document.getElementById('location').value;

        if (locationInput) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: locationInput }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    const lat = results[0].geometry.location.lat();
                    const lng = results[0].geometry.location.lng(); 
                    const location = { lat: lat, lng: lng };
                    searchNearbyRestaurants(location);
                } else {
                    alert('City not found: ' + status);
                }
                });
            } else {
            alert('Plese enter a city.');
            }
        });
    }

    //function to search nearby restaurants based on location
    function searchNearbyRestaurants(location) {
        map.setCenter(location);
    
        const request = {
            location: location,
            radius: '1500',
            type: ['restaurant'],
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, handleResults);
}

//details page (restaurant-details.html): show details for a single restaurant 
function initializeDetailsPage(place_Id) {
    //initialize map with a default location
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.730610, lng: -73.935242 }, // Default location (NYC)
        zoom: 15,
    });

    const request = {
        placeId: place_Id,
        fields: ['name', 'formatted_address', 'geometry', 'rating'],
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, handlePlaceDetails);
}

//handle search for multiple restaurants(for index.html)
function handleResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById('results').innerHTML = ''; //clear previous status
        
        results.forEach((place) => {
            const li = document.createElement('li');
            li.textContent = place.name;

            li.addEventListener('click', () => {
                window.location.href = `restaurant-detail.html?place_id=${place.place_id}`;
            });

            document.getElementById('results').appendChild(li);

            //add marker to map
            const markerElement = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
            });
        });
    } else {
        console.error('Failed to get seadrch results: ', status);
    }
}

//Handle single restaurant details for (restaurant-detail.html)
function handlePlaceDetails(place, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //update details on page
        document.getElementById('restaurant-name').textContent = place.name;
        document.getElementById('restaurant-address').textContent = place.formatted_address;
        document.getElementById('restaurant-rating').textContent = `Rating: ${place.rating || 'N/A'}`;

        //set map to reataurant's location
        map.setCenter(place.geometry.location);

        //add a marker for the restaurant
        const markerElement = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: place.geometry.location,
            title: place.name,
        });
    } else {
        console.error('Failed to get place details ', status);
    }
}

//initialize map when page loads
window.onload = initMap;



