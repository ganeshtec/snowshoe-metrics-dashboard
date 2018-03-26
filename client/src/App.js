import React, { Component } from 'react';
import Homepage from './containers/Homepage';
import './css/app.css'
import Header from './components/Header';

class App extends Component {
  render() {
    return (
      <div className="app">
        <br />
        <Homepage />
        <Header />
      </div>
    )

  }
}

export default App;