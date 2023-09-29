import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React - Deploy by Jenkins, hostes in EC2</h1>          
        </header>
        <p className="App-intro">
          Albertus Septian Angkuw, <code>Submission untuk Proyek Membangun CI/CD Pipeline dengan Jenkins</code>
        </p>
      </div>
    );
  }
}

export default App;
