import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ModelDetails extends Component {

  static propTypes = {
    model: PropTypes.shape({
      name: PropTypes.string.isRequired,
      manufacturer: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      origin: PropTypes.string.isRequired,
    }).isRequired
  }

  render() {
    const model = this.props.model;

    return (
      <div>
        <ul>
          <li>Name: {model.name}</li>
          <li>Manufacturer: {model.manufacturer}</li>
          <li>Year: {model.year}</li>
          <li>Origin: {model.origin}</li>
        </ul>
      </div>
    );
  }
}

export default ModelDetails;
