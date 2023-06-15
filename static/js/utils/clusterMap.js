const windowWidth = window.innerWidth
let mapBoxZoom = 3
windowWidth < 800 ? mapBoxZoom =2:mapBoxZoom = 3
const holder = {"type": "FeatureCollection", "features": []}
for(let item of foundCamps){
    const pushObject = {"type": "Feature", properties: {"title": item.title, "price": item.price, "location": item.location, "id": item._id}, "geometry": item.geometry}
    holder.features.push(pushObject)
}
mapboxgl.accessToken = mbToken;
const map = new mapboxgl.Map({
    container: 'campMap',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-103.5917, 40.6699],
    zoom: mapBoxZoom
});

map.addControl(new mapboxgl.NavigationControl({showCompass: false }))
map.addControl(new mapboxgl.GeolocateControl({}))
map.on('load', () => {
    map.addSource('campsites', {
        type: 'geojson',
        data: holder,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campsites',
        filter: ['has', 'point_count'],
        paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#F0E3A8',
                25,
                '#A8A8F0',
                50,
                '#F0CAB4'
                ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                10,
                10,
                20,
                20,
                25,
                50,
                30,
                100,
                40
                ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campsites',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campsites',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#B4F0EE',
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('campsites').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
            if (err) return;
            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        });
    });

    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const title = e.features[0].properties.title
        const location = e.features[0].properties.location
        const price = e.features[0].properties.price
        const id = e.features[0].properties.id
        
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
        `<b><a href=/campgrounds/${id}>${title}</a></b><br><i>${location}</i><br>$${price}`
        )
        .addTo(map);
        });
        
        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });
    });
