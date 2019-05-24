const Event = require('../../models/event');
const Booking = require('../../models/booking');

const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({ userId: req.userId });
      return bookings.map(booking => transformBooking(booking));
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const hasBooked = await Booking.findOne({
      userId: req.userId,
      eventId,
    });
    if (hasBooked) {
      throw new Error('Already booked the event');
    }
    const booking = new Booking({
      userId: req.userId,
      eventId,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(bookingId).populate('eventId');
      if (!booking) {
        throw new Error('No Such booking');
      }
      await Booking.deleteOne({ _id: bookingId });
      return transformEvent(booking.eventId);
    } catch (error) {
      throw error;
    }
  },
};
