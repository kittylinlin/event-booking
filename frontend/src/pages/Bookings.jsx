import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControls from '../components/Bookings/BookingControls/BookingControls';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: 'list',
  }

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const { token } = this.context;

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        const { bookings } = resData.data;
        this.setState({ bookings, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  }

  deleteBookingHandler = (bookingId) => {
    this.setState({ isLoading: true });
    const { token } = this.context;

    const requestBody = {
      query: `
        mutation CancelBooking($bookingId: ID!) {
          cancelBooking(bookingId: $bookingId) {
            _id
            title
          }
        }
      `,
      variables: {
        bookingId,
      },
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(() => {
        this.setState((prevState) => {
          const bookings = prevState.bookings.filter(booking => booking._id !== bookingId);
          return { bookings, isLoading: false };
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  }

  changeOutputTypeHandler = (outputType) => {
    if (outputType === 'list') {
      this.setState({ outputType });
    } else {
      this.setState({ outputType: 'chart' });
    }
  }

  render() {
    const { isLoading, outputType, bookings } = this.state;
    let content = <Spinner />;

    if (!isLoading) {
      content = (
        <React.Fragment>
          <BookingControls
            activeOutputType={outputType}
            onChange={this.changeOutputTypeHandler}
          />
          <div>
            {outputType === 'list' ? (
              <BookingList
                bookings={bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingChart
                bookings={bookings}
              />
            )
          }
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
