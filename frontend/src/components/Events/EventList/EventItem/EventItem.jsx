import React from 'react';
import PropTypes from 'prop-types';

import './EventItem.css';

const eventItem = (props) => {
  const {
    eventId,
    title,
    price,
    date,
    authUserId,
    creatorId,
    onDetail,
    onDelete,
    onEdit,
  } = props;
  return (
    <li className="event__list-item" key={eventId}>
      <div>
        <h1>{title}</h1>
        <h2>
          {`$ ${price} - ${new Date(date).toLocaleDateString()}`}
        </h2>
      </div>
      <div>
        {authUserId === creatorId
          ? (
            <React.Fragment>
              <button className="btn" type="button" onClick={onEdit.bind(this, eventId)}>
                <i className="fas fa-edit" />
              </button>
              <button className="btn" type="button" onClick={onDelete.bind(this, eventId)}>
                <i className="fas fa-trash" />
              </button>
            </React.Fragment>
          )
          : (
            <button className="btn" type="button" onClick={onDetail.bind(this, eventId)}>
              <i className="fas fa-info-circle" />
            </button>
          )
        }
      </div>
    </li>
  );
};

eventItem.propTypes = {
  eventId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  authUserId: PropTypes.string,
  creatorId: PropTypes.string.isRequired,
  onDetail: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

eventItem.defaultProps = {
  authUserId: null,
};

export default eventItem;
