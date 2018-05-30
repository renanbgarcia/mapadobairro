import React, { Component } from 'react';
import '../App.css';
import MapContainer from './Map.js'

class App extends Component {

  render() {

    return (
      <div className="App">
      <h1>AEHOOOOOOOOOOOOOOOO</h1>
      <MapContainer google={this.props.google} />
      </div>
    );
  }
}

export default App;
