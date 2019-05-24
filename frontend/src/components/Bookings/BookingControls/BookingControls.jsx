import React from 'react';
import PropTypes from 'prop-types';

import './BookingControls.css';

const bookingControls = (props) => {
  const { activeOutputType, onChange } = props;
  return (
    <div className="booking-control">
      <button
        className={activeOutputType === 'list' ? 'active' : ''}
        type="button"
        onClick={onChange.bind(this, 'list')}
      >
        List
      </button>
      <button
        className={activeOutputType === 'chart' ? 'active' : ''}
        type="button"
        onClick={onChange.bind(this, 'chart')}
      >
        Chart
      </button>
    </div>
  );
};

bookingControls.propTypes = {
  activeOutputType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default bookingControls;
