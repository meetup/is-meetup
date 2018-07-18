import React, { Component } from 'react';
import './StatusBar.css';

class StatusBar extends Component {
  render() {
    const { product_name, monitors } = this.props;

    console.log(this.props);

    return (
      <div className="StatusBar">
        <div className="StatusBar-product-info">
          <p>{product_name}</p>
          <p>99.976% uptime for the last 90 days</p>
        </div>
        <span className="StatusBar-bar" />
      </div>
    );
  }
}

export default StatusBar;
