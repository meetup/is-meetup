import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import StatusBar from './StatusBar';

class Monitor extends Component {
  state = {
    showMonitors: false
  };

  handleMonitors = () => {
    this.setState({
      showMonitors: !this.state.showMonitors
    });
  };

  getStateClassName = (monitor) => {
    if (!monitor.overall_state) {
      return;
    }

    if (monitor.overall_state.toLowerCase() === 'ok') {
      return 'success';
    }

    if (monitor.overall_state.toLowerCase() === 'warn' || monitor.overall_state.toLowerCase() === 'no data') {
      return 'warning';
    }

    if (monitor.overall_state.toLowerCase() === 'alert') {
      return 'error';
    }
  };

  render() {
    const { displayModal, product = {} } = this.props;

    return (
      <div>
        <div className="App-current-status" onClick={this.handleMonitors}>
          <div className="App-current-status-header">
            <div className="App-current-status-header-icons">
              <span className={`App-current-status-circle ${this.getStateClassName(product)}`} />
              <h2>{product.product_name}</h2>
            </div>
            <div>
              <p className="App-monitor-count">{product.monitors.length} monitors</p>
              {product.monitors.length > 0 &&
                <span className={`chevron ${this.state.showMonitors ? '' : 'bottom'}`} />
              }
            </div>
          </div>
          {this.state.showMonitors &&
            <ul className="App-monitor-list">
              {product.monitors.map(monitor => (
                <li className="App-monitor-list-item">
                  <a target="_blank" href={`https://app.datadoghq.com/monitors/${monitor.id}`}>
                    <p>{monitor.name}</p>
                    <span className={`App-current-status-circle-small ${this.getStateClassName(monitor)}`} />
                  </a>
                </li>
              ))}
            </ul>
          }
        </div>
        <StatusBar displayModal={displayModal} {...product} />
      </div>
    );
  }
}

export default Monitor;
