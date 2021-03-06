import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import CurrentStatus from './CurrentStatus';
import './StatusBar.css';

class StatusBar extends Component {
  getPastWeek = () => (
    [...Array(30).keys()].map(day => {
      const today = moment();
      return today.subtract(day, 'days').format('YYYY-MM-DD');
    }).reverse()
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
        const currentEvent = events_by_day[day];
        let currentStatus = 'success';

        currentEvent.forEach((event) => {
          if (event.alert_type === 'warning') {
            currentStatus = event.alert_type;
          }

          if (event.alert_type === 'error') {
            currentStatus = event.alert_type;
          }
        });

        status.status = currentStatus;
        status.events = events_by_day[day];
      }

      return status
    });
  };

  render() {
    const { displayModal, product_name, events_by_day = {} } = this.props;

    return (
      <div className="StatusBar">
        <div className="StatusBar-product-info">
          {/* <p className="StatusBar-uptime">Past 30 days</p> */}
        </div>
        <div className="StatusBar-bar">
          {this.getStatus().map((info) => (
            <CurrentStatus displayModal={displayModal} {...info} />
          ))}
        </div>
      </div>
    );
  }
}

export default StatusBar;
