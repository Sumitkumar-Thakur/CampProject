const goodCampground = JSON.parse(campground);
 

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12', 
    center: goodCampground.geometry.coordinates, 
    zoom: 6, 
    });

    const marker = new mapboxgl.Marker()
    .setLngLat(goodCampground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<b>${goodCampground.title}</b><p>${goodCampground.location}</p>`
        )
    )
    .addTo(map)