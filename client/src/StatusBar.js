import React, { Component } from 'react';
import './StatusBar.css';

class StatusBar extends Component {
  render() {
    const { product_name, monitors } = this.props;

    console.log(this.props);

    return (
      <div className="StatusBar">
        <div className="StatusBar-product-info">
          <p className="StatusBar-name">{product_name}</p>
          <p className="StatusBar-uptime">99.976% uptime for the last 90 days</p>
        </div>
        <div className="StatusBar-bar">
          <span className="StatusBar-bar-success"></span>
          <span className="StatusBar-bar-failure"></span>
          <span className="StatusBar-bar-warning"></span>
        </div>
      </div>
    );
  }
}

export default StatusBar;
