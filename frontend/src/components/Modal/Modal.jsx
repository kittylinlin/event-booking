import React from 'react';
import PropTypes from 'prop-types';

import './Modal.css';

const modal = (props) => {
  const {
    title,
    children,
    canCancel,
    canConfirm,
    onCancel,
    onConfirm,
    confirmText,
  } = props;
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">
        {children}
      </section>
      <section className="modal__actions">
        {canCancel && (
          <button className="btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        {canConfirm && (
          <button className="btn" type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        )}
      </section>
    </div>
  );
};

modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  canCancel: PropTypes.bool,
  canConfirm: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string.isRequired,
};

modal.defaultProps = {
  canCancel: false,
  onCancel: () => {},
};

export default modal;
