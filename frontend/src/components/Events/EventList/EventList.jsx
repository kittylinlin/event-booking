import React from 'react';
import PropTypes from 'prop-types';

import EventItem from './EventItem/EventItem';
import './EventList.css';

const eventList = (props) => {
  let { events } = props;
  const {
    authUserId,
    onViewDetail,
    onDelete,
    onEdit,
  } = props;
  events = events.map(event => (
    <EventItem
      key={event._id}
      authUserId={authUserId}
      eventId={event._id}
      title={event.title}
      price={event.price}
      date={event.date}
      creatorId={event.creator._id}
      onDetail={onViewDetail}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  ));

  return (
    <ul className="event__list">
      {events}
    </ul>
  );
};

eventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  authUserId: PropTypes.string,
  onViewDetail: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

eventList.defaultProps = {
  authUserId: null,
};

export default eventList;
