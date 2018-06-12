import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import SideBar from './SideBar.js';

class SimpleMap extends Component {

  constructor(props) {
    super(props)
    // let markers
    this.toggleBounce = this.toggleBounce.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.matchFilter = this.matchFilter.bind(this)
    this.ref = React.createRef()
  }

  state = {
      places: {},
      infoWindow: {},
      markers: {},
      mapHeight: {},
      maps: {},
      map: {},
      filter: '',
      key: 0
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

  toggleBounce(map, maps, item) {
      item.marker.setAnimation(maps.Animation.BOUNCE);
      window.setTimeout(item.marker.setAnimation(null), 2000)
      item.infowindow.open(map, item.marker)
  }

  setFilter(filterString) {
    this.setState({filter: filterString, key: Date.now()}) //atualiza um prop do mapa para forçar a renderizar de novo
  }

  matchFilter(place) {
    let re = new RegExp(this.state.filter, 'i')
    if (place.name.match(re) !== null) {
      return true
    }
  }

  renderMarkers(map, maps) {
    let filtered = this.state.places.results.filter(this.matchFilter)
     let markers = filtered.map((place) => ({       
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
    for (const item of markers) {
        const self = this
        item.marker.addListener('click', function() {self.toggleBounce(map, maps, item)})
    }
    this.setState({markers: markers, maps: maps, map: map})
    if (markers.length > 1) {this.fitMyBounds(map, maps)}
  }

  fitMyBounds(map, maps) {
    let n = -90
    let w = 180
    let s = 90
    let e = -180
    for (let item of this.state.markers) {
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
    let size = {
    width: window.innerWidth,
    height: this.state.mapHeight - 80 // subtraindo 80px para garantir que o ícone do marcador apareça sempre inteiro
    }

    let {center, zoom} = fitBounds({ne, sw}, size);

    map.setCenter(center)
    map.setZoom(zoom)
  }

  render() {
    return (
      <div ref={this.ref} style={{ height: '91vh', width: '100%' }}>
        <SideBar position={ this.props.barposition } places={this.state.markers} bounceFunc={this.toggleBounce} setFilter={this.setFilter} maps={this.state.maps} map={this.state.map}/>
        <GoogleMapReact key={ this.state.key } options={this.createMapOptions} onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
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