import React from 'react';
import PropTypes from 'prop-types';

import './BookingList.css';

const bookingList = (props) => {
  const { bookings, onDelete } = props;

  return (
    <ul className="bookings__list">
      {bookings.map(booking => (
        <li className="bookings__item" key={booking._id}>
          <div className="bookings__item-data">
            {`${booking.event.title} - ${new Date(booking.createdAt).toLocaleDateString()}`}
          </div>
          <div className="bookings__item-actions">
            <button className="btn" type="button" onClick={onDelete.bind(this, booking._id)}>Cancel</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

bookingList.propTypes = {
  bookings: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default bookingList;
