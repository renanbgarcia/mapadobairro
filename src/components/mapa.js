import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';

class SimpleMap extends Component {



  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  state = {
      places: {},
      infoWindow: {},
      markers: {},
      mapHeight: {}
  }

  static defaultProps = {
    center: {
      lat: 43.73333,
      lng: 7.41667
    },
    zoom: 14
  };

  componentWillMount() {
    const places = require('../places/places.json')
    this.setState({places: places})
  }

  componentDidMount() {
    //Verifica a altura do mapa que depende do viewport para usar na definição de zoom
    let mapHeight = this.ref.current.clientHeight
    this.setState({mapHeight: mapHeight})
  }

  renderMarkers(map, maps) {
    const markers = this.state.places.results.map((place) => ({
        marker: new maps.Marker({
            position: place.geometry.location, map,
            title: place.name,
            icon: 'https://png.icons8.com/nolan/50/000000/pizza.png'
        }),
        infowindow: new maps.InfoWindow({content: place.name})
    }))
    for (const item of markers) {
        item.marker.addListener('click', function() {item.infowindow.open(map, item.marker)})
    }
    this.setState({markers: markers})
    this.fitBounds(map, maps)
  }

  fitBounds(map, maps) {
    let n = -90
    let w = 180
    let s = 90
    let e = -180
    for (const item of this.state.markers) {
      let lat = item.marker.getPosition().lat()
      let lng = item.marker.getPosition().lng()
      console.log(`${lat} ${lng}`)
      n = lat > n ? lat : n;
      w = lng < w ? lng : w;
      s = lat < s ? lat : s;
      e = lng > e ? lng : e;
    }

    let ne = {
      lat: n,
      lng: e
    }

    let sw ={
      lat: s,
      lng: w
    }

    //https://github.com/google-map-react/google-map-react/issues/3
    const size = {
    width: window.innerWidth,
    height: this.state.mapHeight
  }

    const {center, zoom} = fitBounds({ne, sw}, size);
    console.log(zoom)
    map.setCenter(center)
    map.setZoom(zoom)
  }

  render() {
    return (
      <div ref={this.ref} style={{ height: '91vh', width: '100%' }}>
        <GoogleMapReact onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
          bootstrapURLKeys={{ key: 'AIzaSyCr6K24EFTY0zlqp_81opo8dUeM38nnq74' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;