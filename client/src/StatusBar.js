import React, { Component } from 'react';

class StatusBar extends Component {
  render() {
    const { product_name, monitors } = this.props;

    console.log(this.props);

    return (
      <div>
        {product_name}
      </div>
    );
  }
}

export default StatusBar;
