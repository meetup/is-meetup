import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.className = 'Modal';
  }

  componentDidMount() {
    this.modalRoot = document.getElementById('modal-root');
    this.modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      <div className="Modal-wrapper">
        {this.props.children}
      </div>,
      this.el,
    );
  }
}

export default Modal;
