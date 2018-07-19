import React, { Component } from 'react';
import moment from 'moment';

class CurrentStatus extends Component {
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
    const { displayModal, status = '', events = [], day = '' } = this.props;
    const { showTooltip } = this.state;

    return (
      <div className={`StatusBar-bar-status ${status}`}>
        {showTooltip &&
          <div className="StatusBar-tooltip">
            <p>{moment(day).format('MMMM Do')}</p>
            <p>{events.length} {events.length === 1 ? 'Event' : 'Events'}</p>
          </div>
        }
        <span
          onClick={() => {
            if (status !== 'success') {
              displayModal(events);
            }
          }}
          className="StatusBar-bar-status-color"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      </div>
    );
  }
}

export default CurrentStatus;
