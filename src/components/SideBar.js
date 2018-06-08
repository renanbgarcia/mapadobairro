import React from 'react'
import '../styles/sidebar.css'
import PlacesList from '../components/placesList'

class SideBar extends React.Component {

	constructor(props) {
		super(props)
		// this.props = this.props.bind(this)
		this.state = { value: '' }
		this.handleInput =this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleInput(e) {
		this.setState({value: e.target.value})
	}

	handleSubmit(e) {
		console.log(this.state.value)
		e.preventDefault()
	}

  render() {
		return(
		<div id="sidebar" style={{ left: this.props.position }}>
			<form onSubmit={this.handleSubmit}>
				<label>
					Filter:
					<input type="text" name="query" onChange={ this.handleInput}/>
				</label>
				<input type="submit" value="Submit" />
			</form>
			<PlacesList places={this.props.places} bounce={this.props.bounceFunc} maps={this.props.maps}/>
		</div>
		)
	}
}

export default SideBar