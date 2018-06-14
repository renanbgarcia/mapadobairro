import React from 'react'
import '../styles/sidebar.css'

const PlacesList = (props) => {

	let list = []
	if (props.places[0]){
		for (let place in props.places) {
			list.push(props.places[place])
		}
		const listItems = list.map((place) => <li key={place.marker.id} onClick={() => props.bounce(props.map, props.maps, place)}>{place.marker.title}</li>)
		return (
			<ul className = 'list'>
				{listItems}
			</ul>
		)
	} else {
		return (<p>Sua busca não retornou resultados</p>)
	}

}

export default PlacesList