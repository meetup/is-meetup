import React, { Component } from 'react';
import './StatusBar.css';

class StatusBar extends Component {
  state = {
    showTooltip: false
  };

  handleMouseEnter = () => {
    this.setState({
      showTooltip: true
    });
  };

  handleMouseLeave = () => {
    this.setState({
      showTooltip: false
    });
  };

  render() {
    const { displayModal, product_name, monitors } = this.props;
    const { showTooltip } = this.state;

    console.log(this.props);

    return (
      <div className="StatusBar">
        <div className="StatusBar-product-info">
          <p className="StatusBar-name">{product_name}</p>
          <p className="StatusBar-uptime">99.976% uptime for the last 90 days</p>
        </div>
        <div className="StatusBar-bar">
          {showTooltip &&
            <div className="StatusBar-tooltip">
              tools
            </div>
          }
          <span
            onClick={displayModal}
            className="StatusBar-bar-status success"
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          />
          <span className="StatusBar-bar-status failure"></span>
          <span className="StatusBar-bar-status warning"></span>
        </div>
      </div>
    );
  }
}

export default StatusBar;
