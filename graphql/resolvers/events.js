const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => transformEvent(event));
    } catch (error) {
      throw error;
    }
  },
  createEvent: async ({ eventInput }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new Event({
      title: eventInput.title,
      description: eventInput.description,
      price: +eventInput.price,
      date: new Date(eventInput.date),
      creator: req.userId,
    });
    try {
      const result = await event.save();
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return transformEvent(result);
    } catch (error) {
      throw error;
    }
  },
  deleteEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('No such event');
      }
      if (event.creator.toString() !== req.userId) {
        throw new Error('No permission');
      }
      const bookings = await Booking.find({ eventId });
      if (bookings.length !== 0) {
        throw new Error('Someone has booked the event!');
      }
      await Event.deleteOne({ _id: eventId });
      return true;
    } catch (error) {
      throw error;
    }
  },
};
