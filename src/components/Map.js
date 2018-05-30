import React from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'
import { stringify } from 'querystring';

export class MapContainer extends React.Component {

  constructor(props) {
    super(props)
    this.google = this.props.google
  }

	state = {
    selectedPlace: {},
    marker: {},
    showingInfoWindow: false,
    places: {}
	}

  componentWillMount() {
    let places = require('../places/places.json')
    console.log(places)
    this.setState({places: places})
  }

  onMarkerClick(props, marker) {
    console.log(this.props)
    this.setState({
      selectedPlace: props,
      marker: marker,
      name: marker.name,
      vicinity: marker.vicinity,
      showingInfoWindow: true
    })
  }

  render() {
    return (
    <div>
        <Map google={this.google} zoom={15} initialCenter={ {lat: 43.73333, lng: 7.41667} }>
      
          {this.state.places.results.map((place) => 
            <Marker onClick={this.onMarkerClick.bind(this)}
            title={place.name}
            name={place.name}
            position={place.geometry.location}
            icon={'https://png.icons8.com/nolan/50/000000/pizza.png'}
            vicinity={place.vicinity} />
          )}
 
        <InfoWindow visible={this.state.showingInfoWindow} marker={this.state.marker}>
            <div>
              <h1>{this.state.name}</h1>
              <p>{this.state.vicinity}</p>
            </div>
        </InfoWindow>
      </Map>
      </div>
    );
  }
}
 
export default GoogleApiWrapper({
  libraries: ['places'],
  apiKey: ('AIzaSyCr6K24EFTY0zlqp_81opo8dUeM38nnq74')
})(MapContainer)