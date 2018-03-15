import React, { Component } from 'react';
import Homepage from './components/Homepage';
import './css/App.css'
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