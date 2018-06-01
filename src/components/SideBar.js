import React from 'react'
import '../styles/sidebar.css'

class SideBar extends React.Component {

  render() {
		return(
		<div id="sidebar" style={{ left: this.props.position }}>Teste</div>
		)
	}
}

export default SideBar