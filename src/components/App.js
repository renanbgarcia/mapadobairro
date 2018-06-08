import React, { Component } from 'react';
import '../App.css';
import SideBar from './SideBar.js';
// import MapContainer from './Map.js';
import SimpleMap from './mapa'

class App extends Component {

  state = {
    sideBarPosition: '-500px',
    sideBarHidden: true
  }

  toggleSideBar() {
    if (this.state.sideBarHidden === true) {
      this.setState({
        sideBarPosition: '0',
        sideBarHidden: false
      })
    } else {
      this.setState({
        sideBarPosition: '-500px',
        sideBarHidden: true
      })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <button className="menu-button" onClick={() => this.toggleSideBar()}/>
          <h1>Pizza em Mônaco</h1>
        </div>
        {/* <SideBar position={ this.state.sideBarPosition }/> */}
        <SimpleMap barposition={ this.state.sideBarPosition }/>
      </div>
    );
  }
}

export default App;
