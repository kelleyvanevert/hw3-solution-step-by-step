import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';

import ModelDetails from './components/ModelDetails';

const data = {
  "Ivel Z3": {
    manufacturer: "Ivasim",
    year: 1969,
    origin: "Croatia"
  },
  "Bally Astrocade": {
    manufacturer: "Bally Consumer Products",
    year: 1977,
    origin: "USA"
  },
  "Sord M200 Smart Home Computer": {
    manufacturer: "Sord Computer Corporation",
    year: 1971,
    origin: "Japan"
  },
  "Commodore 64": {
    manufacturer: "Commodore",
    year: 1982,
    origin: "USA"
  }
}

class App extends Component {

  state = {
    selectedModel: "",
  }

  updateSelection = (event) => {
    console.log("select change event", event.target, event.target.value)
    this.setState({ selectedModel: event.target.value })
  }

  addSelectedModel = () => {
    if (data[this.state.selectedModel]) {
      this.props.dispatch({
        type: 'ADD_MODEL',
        payload: {
          ...data[this.state.selectedModel],
          name: this.state.selectedModel
        }
      })
    }
  }

  render() {
    return (
      <div className="App">
        <h2>List:</h2>
        {this.props.computerList.map((model, i) =>
          <ModelDetails key={i} model={model} />
        )}
        <h2>Add a new computer:</h2>
        <select value={this.state.selectedModel} onChange={this.updateSelection}>
          <option>-- pick a model --</option>
          {Object.entries(data).map(([name, data]) =>
            <option key={name} value={name}>{name} ({data.year})</option>
          )}
        </select>
        <button onClick={this.addSelectedModel}>Add it!</button>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    computerList: state
  }
}

export default connect(mapStateToProps)(App);
