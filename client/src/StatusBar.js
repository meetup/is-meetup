import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
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

  getPastWeek = () => (
    [0, 1, 2, 3, 4, 5, 6, 7].map(day => {
      const today = moment();
      return today.subtract(day, 'days').format('YYYY-MM-DD');
    })
  );

  getStatus = () => {
    const { events_by_day } = this.props;
    const thisWeek = this.getPastWeek();
    const eventsArray = !_.isEmpty(events_by_day) ? Object.keys(events_by_day) : [];

    return thisWeek.map(day => {
      const status = {
        day,
        status: 'success',
        events: []
      };

      if (eventsArray.indexOf(day) > -1) {
        status.status = 'error';
        status.events = events_by_day[day];
      }

      return status
    });
  };

  render() {
    const { displayModal, product_name, events_by_day = {} } = this.props;
    const { showTooltip } = this.state;

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
          {this.getStatus().map((info) => (
            <span
              onClick={() => {
                if (info.status !== 'success') {
                  displayModal(info);
                }
              }}
              className={`StatusBar-bar-status ${info.status}`}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default StatusBar;
