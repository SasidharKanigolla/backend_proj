
mapboxgl.accessToken = mapToken;        //Taking mapToken from show.js

const map = new mapboxgl.Map({
container: 'map', // container ID       //id reference for the div
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});
// console.log(coordinates)
const marker = new mapboxgl.Marker({ color: "red"})
    .setLngLat(listing.geometry.coordinates)       //Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})          //setting popup means by clicking that we will get a message
    .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking!</p>`))
    .addTo(map);        //Adding all these components to the map