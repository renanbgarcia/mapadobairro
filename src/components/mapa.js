import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import SideBar from './SideBar.js';
import flickerAPI from './flickerAPI'

class SimpleMap extends Component {

  constructor(props) {
    super(props)
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
      lat: 41.89193,
      lng: 12.51133
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
    // Verifica a altura do mapa que depende do viewport para usar na definição de zoom
    let mapHeight = this.ref.current.clientHeight
    this.setState({mapHeight: mapHeight})
  }

  toggleBounce(map, maps, item) {
      item.marker.setAnimation(maps.Animation.BOUNCE);
      this.getPhotos(item)
      window.setTimeout(item.marker.setAnimation(null), 2000)
      item.infowindow.open(map, item.marker)
  }

  setFilter(filterString) {
    this.setState({
      filter: filterString,
      key: Date.now() //atualiza um prop do mapa para forçar a renderizar de novo
    }) 
  }

  matchFilter(place) {
    let re = new RegExp(this.state.filter, 'i')
    if (place.name.match(re) !== null) {
      return true
    }
  }

  //Método chamado por getPhotos() para iterar pelo array de fotor e criar os elementos necessários 
  iteratePhotos(resp) {
    let str =''
    if (resp[0]){
      for (let i = 0; i < 10; i++) {
        if (resp[i]) {
          str = str + `<img id='imagenes' src= ${resp[i]}>`
        }
      }
    } else {
      str = '<p>Não há imagens para mostrar</p>'
    }
    return `<div id='img-container'>${str}</div>`
  }

  //Métodos chamado por getPhotos() para definir a largura da infowindow dependendo do viewport
  sizeInfoWindow(item) {
    if (window.innerWidth < 750) {
      item.infowindow.setOptions({maxWidth: 200})
    } else {
      item.infowindow.setOptions({maxWidth: 400})
    }
  }

  //Método chamado por toggleBounce() para carregar imagens da API do flicker
  getPhotos(item) {
    const location = item.marker.position
    const flicker = new flickerAPI()
    flicker.setLatLon(location.lat(), location.lng())
    const url = flicker.searchPhotos()
    url.then((resp) => item.infowindow.setContent(`
      <h1>${item.marker.title}</h1>
      <h2>*** ${item.place.vicinity} ***</h2>
      <p>Fotos nas proximidades (Flicker)</p>
      ${this.iteratePhotos(resp)}
    `))
    this.sizeInfoWindow(item)
  }

  initMap(map, maps) {
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
      infowindow: new maps.InfoWindow({
        // GIF By Ahm masum [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], from Wikimedia Commons
        content: `<h1>${place.name}</h1><img src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif' width='100%'>`
      }),
      place: place
      })
    )

    for (const item of markers) {
        const self = this
        item.marker.addListener('click', function() {self.toggleBounce(map, maps, item)})
    }

    this.setState({markers: markers, maps: maps, map: map})

    /* Se o filtro retornar mais de um marcador, chama fitMyBounds() para calcular o centro e o zoom,
    se retornar apenas um, centraliza nesse único marcador */
    if (markers.length > 1) {
      this.fitMyBounds(map, maps)
    } else if (markers.length === 1) {
      map.setCenter(markers[0].marker.position)
    }
  }

  fitMyBounds(map, maps) {
    let n = -90
    let w = 180
    let s = 90
    let e = -180
    for (let item of this.state.markers) {
      const lat = item.marker.getPosition().lat()
      const lng = item.marker.getPosition().lng()
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
        <SideBar 
          position={ this.props.barposition } 
          places={this.state.markers} 
          bounceFunc={this.toggleBounce} 
          setFilter={this.setFilter} 
          maps={this.state.maps} 
          map={this.state.map}
        />
        <GoogleMapReact 
          key={ this.state.key } 
          options={this.createMapOptions} 
          onGoogleApiLoaded={({map, maps}) => this.initMap(map, maps)}
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