import React from 'react'
import GoogleMapReact, { maps } from 'google-map-react';
import '../styles/sidebar.css'

const PlacesList = (props) => {

	let list = []
	for (let place in props.places) {
		list.push(props.places[place])
	}
	const listItems = list.map((place) => <li onClick={() => props.bounce(props.map, props.maps, place)}>{place.marker.title}</li>)
  return (
		<ul className = 'list'>
			{listItems}
		</ul>
	)
}

export default PlacesList