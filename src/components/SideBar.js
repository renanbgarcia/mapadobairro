import React from 'react'
import '../styles/sidebar.css'
import PlacesList from '../components/placesList'

class SideBar extends React.Component {

	constructor(props) {
		super(props)
		this.state = { value: '' }
		this.handleInput =this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleInput(e) {
		this.setState({value: e.target.value})
	}

	handleSubmit(e) {
		this.props.setFilter(this.state.value)
		e.preventDefault()
	}

  render() {
		return(
		<div id="sidebar" style={{ left: this.props.position }}>
			<form onSubmit={ this.handleSubmit }>
				<div id='filterbox'>
					<input id='filterInput' type="text" name="query" onChange={ this.handleInput }/>
					<input id='btn' type="submit" value="" />
				</div>
			</form>
			<PlacesList places={ this.props.places } bounce={ this.props.bounceFunc } maps={ this.props.maps } map={ this.props.map }/>
			<div className='credits'>Icons made by <a href="https://www.flaticon.com/authors/kirill-kazachek" title="Kirill Kazachek">Kirill Kazachek</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
			<div className='credits'><a href="https://icons8.com">Icon pack by Icons8</a></div>
		</div>
		)
	}
}

export default SideBar