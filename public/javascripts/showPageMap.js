// const goodCampground = JSON.parse(campground);
 

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12', 
    center: campground.geometry.coordinates, 
    zoom: 6, 
    });

    const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<b>${campground.title}</b><p>${campground.location}</p>`
        )
    )
    .addTo(map)