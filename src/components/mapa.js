import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import SideBar from './SideBar.js';

class SimpleMap extends Component {

  constructor(props) {
    super(props)
    let markers
    this.toggleBounce = this.toggleBounce.bind(this)
    this.ref = React.createRef()
  }

  state = {
      places: {},
      infoWindow: {},
      markers: {},
      mapHeight: {},
      maps: {}
  }

  static defaultProps = {
    center: {
      lat: 43.73333,
      lng: 7.41667
    },
    zoom: 14,
    barposition: 0,
  };

  createMapOptions(maps) {
      return {
        styles: [{
          featureType: 'poi',
          stylers: [{
            visibility: "off"
          }]
        }]
      }
    }

  componentWillMount() {
    const places = require('../places/places.json')
    this.setState({places: places})
  }

  componentDidMount() {
    //Verifica a altura do mapa que depende do viewport para usar na definição de zoom
    let mapHeight = this.ref.current.clientHeight
    this.setState({mapHeight: mapHeight})
  }

  toggleBounce(maps, marker) {
      marker.setAnimation(maps.Animation.BOUNCE);
      window.setTimeout(marker.setAnimation(null), 2000)
  }

  renderMarkers(map, maps) {
    console.log(this.state.places.results)
    this.markers = this.state.places.results.map((place) => ({
        marker: new maps.Marker({
            position: place.geometry.location, 
            map: map,
            title: place.name,
            animation: maps.Animation.DROP,
            icon: 'https://png.icons8.com/nolan/50/000000/pizza.png',
            zIndex: 50 //Para corrigir um problema que os markers na metade superior da tela não ficavam clicáveis
        }),
        infowindow: new maps.InfoWindow({content: `<h1>${place.name}</h1>`})
    }))
    for (const item of this.markers) {
        const self = this
        item.marker.addListener('click', function() {item.infowindow.open(map, item.marker)})
        item.marker.addListener('click', function() {self.toggleBounce(maps, item.marker)})
    }
    console.log(this.markers)
    this.setState({markers: this.markers})
    this.setState({maps: maps})
    this.fitMyBounds(map, maps)
  }

  fitMyBounds(map, maps) {
    let n = -90
    let w = 180
    let s = 90
    let e = -180
    for (const item of this.state.markers) {
      let lat = item.marker.getPosition().lat()
      let lng = item.marker.getPosition().lng()
      n = lat > n ? lat : n;
      w = lng < w ? lng : w;
      s = lat < s ? lat : s;
      e = lng > e ? lng : e;
    }

    let ne = {lat: n, lng: e}
    let sw ={lat: s, lng: w}

    //https://github.com/google-map-react/google-map-react/issues/3 como centralizar e atualizar o zoom baseado nos markers
    const size = {
    width: window.innerWidth,
    height: this.state.mapHeight
    }

    const {center, zoom} = fitBounds({ne, sw}, size);
    map.setCenter(center)
    map.setZoom(zoom)
  }



  render() {
    return (
      <div ref={this.ref} style={{ height: '91vh', width: '100%' }}>
        <SideBar position={ this.props.barposition } places={this.state.markers} bounceFunc={this.toggleBounce} maps={this.state.maps}/>
        <GoogleMapReact options={this.createMapOptions} onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
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