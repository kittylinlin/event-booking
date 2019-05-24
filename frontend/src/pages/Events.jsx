import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import DatePicker from 'react-datepicker';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

import AuthHelperMethods from '../components/Auth/AuthHelperMethods';

import './Events.css';
import 'react-datepicker/dist/react-datepicker.css';

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
    title: '',
    price: '',
    date: new Date(),
    description: '',
    createAlert: false,
    message: '',
    deleteAlert: false,
  };

  isActive = true;

  Auth = new AuthHelperMethods();

  componentDidMount() {
    this.fetchEvents();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  }

  handleInputChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  }

  handleDateChange = (date) => {
    this.setState({ date });
  }

  closeCreateAlert = () => {
    this.setState({
      createAlert: false,
      creating: true,
    });
  }

  closeDeleteAlert = () => {
    this.setState({
      deleteAlert: false,
    });
  }

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const {
      title,
      price,
      date,
      description,
    } = this.state;

    if (
      isEmpty(title.trim())
      || isEmpty(price)
      || !date
      || isEmpty(description.trim())
    ) {
      this.setState({
        createAlert: true,
        message: 'Make sure all fields are filled!',
      });
      return;
    }

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!) {
          createEvent(eventInput: { title: $title, price: $price, date: $date, description: $description }) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title,
        price: +price,
        date: date.toISOString(),
        description,
      },
    };

    this.Auth.fetch({
      body: JSON.stringify(requestBody),
    })
      .then((resData) => {
        this.setState((prevState) => {
          prevState.events.push({
            ...resData.data.createEvent,
            creator: {
              _id: this.Auth.userId(),
            },
          });
          return prevState;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  }

  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find(event => event._id === eventId);
      return { selectedEvent };
    });
  }

  deleteEventHandler = (eventId) => {
    if (!this.Auth.loggedIn()) {
      return;
    }
    const requestBody = {
      query: `
        mutation DeleteEvent($eventId: ID!) {
          deleteEvent(eventId: $eventId)
        }
      `,
      variables: {
        eventId,
      },
    };

    this.Auth.fetch({
      body: JSON.stringify(requestBody),
    })
      .then(() => {
        this.setState((prevState) => {
          const events = prevState.events.filter(event => event._id !== eventId);
          return { events };
        });
      })
      .catch((error) => {
        this.setState({
          deleteAlert: true,
          message: error.message,
        });
      });
  }

  bookEventHandler = () => {
    const { selectedEvent } = this.state;
    if (!this.Auth.loggedIn()) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($eventId: ID!) {
          bookEvent(eventId: $eventId) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        eventId: selectedEvent._id,
      },
    };

    this.Auth.fetch({
      body: JSON.stringify(requestBody),
    })
      .then(() => {
        this.setState({ selectedEvent: null });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchEvents() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
            }
          }
        }
      `,
    };

    this.Auth.fetch({
      body: JSON.stringify(requestBody),
    })
      .then((resData) => {
        const { events } = resData.data;
        if (this.isActive) {
          this.setState({ events, isLoading: false });
        }
      })
      .catch((error) => {
        console.log(error);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  render() {
    const {
      creating,
      events,
      isLoading,
      selectedEvent,
      title,
      price,
      date,
      description,
      createAlert,
      deleteAlert,
      message,
    } = this.state;

    return (
      <React.Fragment>
        {(creating || selectedEvent || createAlert || deleteAlert) && <Backdrop />}
        {createAlert && (
          <Modal
            title=""
            canConfirm
            onConfirm={this.closeCreateAlert}
            confirmText="OK"
          >
            <h1>{message}</h1>
          </Modal>
        )}
        {deleteAlert && (
          <Modal
            title=""
            canConfirm
            onConfirm={this.closeDeleteAlert}
            confirmText="OK"
          >
            <h1>{message}</h1>
          </Modal>
        )}
        {creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">
                  Title
                  <input
                    type="text"
                    id="title"
                    value={title}
                    name="title"
                    onChange={this.handleInputChange}
                  />
                </label>
              </div>
              <div className="form-control">
                <label htmlFor="price">
                  Price
                  <input
                    type="number"
                    id="price"
                    value={price}
                    name="price"
                    onChange={this.handleInputChange}
                  />
                </label>
              </div>
              <div className="form-control">
                Date
                <div className="form-control">
                  <DatePicker
                    dateFormat="yyyy-MM-dd"
                    selected={date}
                    onChange={this.handleDateChange}
                    minDate={new Date()}
                  />
                </div>
              </div>
              <div className="form-control">
                <label htmlFor="description">
                  Description
                  <textarea
                    id="description"
                    rows="4"
                    value={description}
                    name="description"
                    onChange={this.handleInputChange}
                  />
                </label>
              </div>
            </form>
          </Modal>
        )}
        {selectedEvent && (
          <Modal
            title={selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.Auth.loggedIn() ? 'Book' : 'Confirm'}
          >
            <h1>{selectedEvent.title}</h1>
            <h2>
              {`$ ${selectedEvent.price} - ${new Date(selectedEvent.date).toLocaleDateString()}`}
            </h2>
            <p>{selectedEvent.description}</p>
          </Modal>
        )}
        {this.Auth.loggedIn() && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" type="button" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {isLoading
          ? <Spinner />
          : (
            <EventList
              events={events}
              authUserId={this.Auth.userId()}
              onViewDetail={this.showDetailHandler}
              onDelete={this.deleteEventHandler}
              onEdit={this.editEventHandler}
            />
          )
        }
      </React.Fragment>
    );
  }
}

export default EventsPage;
