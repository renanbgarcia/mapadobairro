import React from 'react'
import GoogleMapReact, { maps } from 'google-map-react';

const PlacesList = (props) => {

	let list = []
	for (let place in props.places) {
		list.push(props.places[place].marker)
		console.log(props)
	}
	const listItems = list.map((marker) => <li onClick={() => props.bounce(props.maps, marker)}>{marker.title}</li>)
	console.log(list)
  return (
		<ul>
			{listItems}
		</ul>
	)
}

export default PlacesList